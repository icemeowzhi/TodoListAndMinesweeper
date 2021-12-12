//棋盘，负责cell的生成、渲染和管理

//cell的数据，二维数组
let cellData;

//初始化cellData，由用户指定多少，雷个数
function createCell(xSize,ySize,mineCount){}

//重制棋盘
function refreshCell(){}

//渲染棋盘，仅调用一次
function renderGrid(){}

//渲染cell及上面的数字等等,在检查为合法操作（单击cell等）后调用。
function renderCell(){}

//通过位置查找cell
function getCellByPos(x,y){}

//查找cell的位置
function getPosByCell(cell){}

//查找临近的cell
function getNextCell(direction,cell){}

//返回周围八格的雷数
function countMineAround(cell){}

//翻转所有格，如果有mark的格子，取消mark
function flipAll(){}