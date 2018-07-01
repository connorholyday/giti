# giti

Git-i is a git repository browser made for IBM i (although it can run on other systems). The reason behind it was because I was hosting bare repos on IBM i without a pleasent git front end to manage and browse my repo commits. Since IBM i cannot yet run the likes of GitLab, I am creating this temp solution.

### Setup

1. `git clone https://github.com/WorksOfBarry/giti.git`
2. `cd giti`
3. `npm i`
4. Edit the `dataSet` variable in `config.js` and add you existing repos. You may also want to change the port number. (step to be removed later) - `maxCommits` is used when looking at the commits of a repo. It meats X latest commits.
5. `node index`

## To do

1. Make it so the user only edits a `config.json` file and not the actual source.
2. Ability to add and remove repos without having to edit the config.