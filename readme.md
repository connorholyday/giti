# giti

Git-i is a git repository browser made for IBM i (although it can run on other systems). The reason behind it was because I was hosting bare repos on IBM i without a pleasant git front end to manage and browse my repo commits. Since IBM i cannot yet run the likes of GitLab, I am creating this temp solution.

### Features

* Add/remove repos easily
* Repo dashboard with: last 5 commits, branches, tree at last commit
* Commit history
* Commit diffs (they're pretty too)
* Browse tree at certain commit

### Setup

1. `git clone https://github.com/WorksOfBarry/giti.git`
2. `cd giti`
3. `npm i`
4. Edit the `repos` variable in `config.json` and add your existing repos. You may also want to change the port number. `maxCommits` is used when looking at the commits of a repo. It means X latest commits.
5. `node index` to run

## To do

1. Show markdown readme on dashboard (like GitHub does)
2. Show history of a single file when looking at that file (`/blob`)