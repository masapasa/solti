use anchor_lang::prelude::*;

// Need to update this ID after the first deployment to localnet (e.g. by running scripts/update-lib-rs.sh).
declare_id!("DnjcDHRBm5r2pADBZ6SWxynFKk96egQDwrRCAMsURuGk");

fn add(data_account: &mut Account<DataAccount>, user: &mut Signer, url: String) -> Result<()> {
    let submission = Submission {
        url: url.to_string(),
        author: *user.to_account_info().key,
        votes: 0,
    };

    // TODO: Is this needed?
    require!(
        data_account.submissions.len() < (usize::MAX - 1),
        SolvationError::SubmissionCountExceeded
    );

    data_account.submissions.push(submission);
    Ok(())
}

#[program]
pub mod sollery {
    use super::*;

    pub fn init_data_account(context: Context<DataAccountContext>, url: String) -> Result<()> {
        let data_account = &mut context.accounts.data_account;
        let user = &mut context.accounts.user;

        return add(data_account, user, url);
    }

    pub fn add_submission(context: Context<SubmissionContext>, url: String) -> Result<()> {
        let data_account = &mut context.accounts.data_account;
        let user = &mut context.accounts.user;

        return add(data_account, user, url);
    }

    pub fn upvote_submission(context: Context<SubmissionContext>, index: u8) -> Result<()> {
        let data_account = &mut context.accounts.data_account;
        // TODO: Does the require statement bloat the program?
        require!(
            usize::from(index) < data_account.submissions.len(),
            SolvationError::SubmissionIndexOutOfRange
        );

        data_account.submissions[index as usize].votes += 1;
        Ok(())
    }

    pub fn downvote_submission(context: Context<SubmissionContext>, index: u8) -> Result<()> {
        let data_account = &mut context.accounts.data_account;
        // TODO: Does the require statement bloat the program?
        require!(
            usize::from(index) < data_account.submissions.len(),
            SolvationError::SubmissionIndexOutOfRange
        );

        data_account.submissions[index as usize].votes -= 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct DataAccountContext<'info> {
    // #[account(init, payer = user, space = 9000)]
    #[account(
        init,
        // seeds = [user.key().as_ref()],
        seeds = [b"7"],
        bump,
        payer = user,
        space = 9000
    )]
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

#[account]
pub struct DataAccount {
    pub submissions: Vec<Submission>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Submission {
    pub url: String,
    pub author: Pubkey,
    pub votes: i64,
}

#[error_code]
pub enum SolvationError {
    #[msg("The submission count is limited to usize::MAX.")]
    SubmissionCountExceeded,
    #[msg("The submission being voted on is out of range.")]
    SubmissionIndexOutOfRange,
}
