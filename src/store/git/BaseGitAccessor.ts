import { join } from "path";
import { readFile } from "fs/promises";

import AsyncLock from "async-lock";
import Git, { Repository } from "nodegit";


export interface HistoryInfo {
  hash: string;
  committedAt: Date;
  committedBy: string;
}


class BaseGitAccessor {
  
  readonly repository: Repository;
  private readonly accessLock: AsyncLock;

  protected constructor(repository: Repository) {
    this.repository = repository;
    this.accessLock = new AsyncLock();    
  }

  static async create(root: string): Promise<BaseGitAccessor> {
    const client = await Git.Repository.open(root);
    return new BaseGitAccessor(client);
  } 

  // private async execute(cmd: string) {
  //   try {
  //     return await promisify(exec)(`git ${cmd}`, { cwd: this.root,  });
  //   } catch (error) {
  //     console.warn(`[GitStoreCenter] Try to execute cmd [${cmd}] but failed with exception ${error}. `);
  //     throw error;
  //   }
  // }

  async show(branch: string, fn: string) {
    const currentBranch = await this.getCurrentBranch();

    if (currentBranch === branch) {
      const buffer = await readFile(join(this.repository.workdir(), fn));
      return buffer.toString();
    } else {
      const commit = await this.repository.getBranchCommit(branch);
      const tree = await commit.getTree();
      const entry = await tree.getEntry(fn);
      const blob = await entry.getBlob();
      return blob.content().toString();
    }
  }

  async getStatus() {
    return await this.repository.getStatus();
  }

  async getCurrentBranch() {
    const ref = await this.repository.getCurrentBranch();
    return ref.name();
  }

  // async checkout(branch: string) {
  //   await this.accessLock.acquire("branch_lock", async () => {
  //     const cmd = `checkout ${branch}`;
  //     const { stdout } = await this.execute(cmd);
  //   });
  // }

  // async commit(message: string, fns: string[]) {
  //   const cmd = `add ${fns.join(' ')} && commit -m ${message}`;
  //   const { stdout } = await this.execute(cmd);
  // }

  async history(branch: string, targetPath: string): Promise<HistoryInfo[]> {
    const commit = await this.repository.getBranchCommit(branch);

    const walker = this.repository.createRevWalk();
    // @ts-ignore
    walker.push(commit.sha());
    walker.sorting(Git.Revwalk.SORT.TIME);
    const historyCommits = await walker.fileHistoryWalk(targetPath, 500);

    return historyCommits.map((entry) => {
      const commit = entry.commit;

      return {
        hash: commit.sha(),
        committedAt: commit.date(),
        committedBy: commit.author().name(),
      };
    });
  }
}


export default BaseGitAccessor;
