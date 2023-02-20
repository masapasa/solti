use anchor_lang::prelude::*;

// Need to update this ID after the first deployment to localnet (e.g. by running scripts/update-lib-rs.sh).
declare_id!("5KeLPA4bsXnC9XxcVgAdKcFTNiYx74CHxa4FvLgBR2rU");

#[program]
pub mod sollery {
    use super::*;

    pub fn init_data_account(ctx: Context<InitDataAccount>) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        base_account.image_url_count = 0;
        Ok(())
    }

    pub fn add_image_url(ctx: Context<AddImageUrl>, image_url: String) -> Result <()> {
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        let item = ItemStruct {
            image_url: image_url.to_string(),
            user_address: *user.to_account_info().key,
            votes: 0
        };

        base_account.image_url_list.push(item);
        base_account.image_url_count += 1;
        Ok(())
    }

    pub fn upvote_image_url(ctx: Context<AddImageUrl>, index: u8) -> Result <()> {
        let base_account = &mut ctx.accounts.base_account;
        base_account.image_url_list[index as usize].votes += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitDataAccount<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddImageUrl<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub image_url: String,
    pub user_address: Pubkey,
    pub votes: u64,
}

#[account]
pub struct BaseAccount {
    pub image_url_count: u64,
    pub image_url_list: Vec<ItemStruct>,
}
