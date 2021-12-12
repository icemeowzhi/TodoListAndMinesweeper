//负责cell的数据结构
class MineCell {
    constructor(isMine) {
        this.isMine = isMine;
        this.fliped = false;
        this.marked = false;
    }
    flip(){
        this.fliped = true;
        this.marked = false;
        if (this.isMine === true){
            gameFailed()
        }
    }
}