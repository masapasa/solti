use anchor_lang::prelude::*;

// Need to update this ID after the first deployment to localnet (e.g. by running scripts/update-lib-rs.sh).
declare_id!("25to815MeTgAP5q87EkbSFqBh1XgL2AR6DZwHNKyEGkX");

#[program]
pub mod sollery {
    use super::*;

    pub fn init_data_account(context: Context<DataAccountContext>) -> Result<()> {
        let data_account = &mut context.accounts.data_account;
        data_account.submission_count = 0;
        Ok(())
    }

    pub fn add_submission(context: Context<SubmissionContext>, url: String) -> Result <()> {
        let data_account = &mut context.accounts.data_account;
        let user = &mut context.accounts.user;

        let submission = Submission {
            url: url.to_string(),
            author: *user.to_account_info().key,
            votes: 0
        };

        data_account.submissions.push(submission);
        data_account.submission_count += 1;
        Ok(())
    }

    pub fn upvote_submission(context: Context<SubmissionContext>, index: u8) -> Result <()> {
        let data_account = &mut context.accounts.data_account;
        data_account.submissions[index as usize].votes += 1; // TODO: Check if there's actually something at the given index.
        Ok(())
    }

    pub fn downvote_submission(context: Context<SubmissionContext>, index: u8) -> Result <()> {
        let data_account = &mut context.accounts.data_account;
        data_account.submissions[index as usize].votes -= 1; // TODO: Check if there's actually something at the given index.
        Ok(())
    }

    // pub fn noop() -> Result <()> {
    //     Ok(())
    // }
}

#[derive(Accounts)]
pub struct DataAccountContext<'info> {
    #[account(init, payer = user, space = 9000)]
    pub data_account: Account<'info, DataAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmissionContext<'info> {
    #[account(mut)]
    pub data_account: Account<'info, DataAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Submission {
    pub url: String,
    pub author: Pubkey,
    pub votes: u64,
}

#[account]
pub struct DataAccount {
    pub submission_count: u64,
    pub submissions: Vec<Submission>,
}
