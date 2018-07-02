# giti

Git-i is a git repository browser made for IBM i (although it can run on other systems). The reason behind it was because I was hosting bare repos on IBM i without a pleasant git front end to manage and browse my repo commits. Since IBM i cannot yet run the likes of GitLab, I am creating this temp solution.

### Setup

1. `git clone https://github.com/WorksOfBarry/giti.git`
2. `cd giti`
3. `npm i`
4. Edit the `repos` variable in `config.json` and add your existing repos. You may also want to change the port number. `maxCommits` is used when looking at the commits of a repo. It means X latest commits.
5. `node index` to run

## To do

1. Remove three links to Commits, Branches & Remove - create a repo dash board instead.
2. Add button to clone into home directory and preview commands to clone onto local machine over SSH

---

## Screenshots

![](https://i.imgur.com/TvqtVsV.png)
![](https://i.imgur.com/hCvlkmk.png)
![](https://i.imgur.com/OTav5Wo.png)
![](https://i.imgur.com/RbY8mpi.png)
![](https://i.imgur.com/9tOe7F0.png)
![](https://i.imgur.com/IyxgIE1.png)
