pragma solidity ^0.5.0;

contract Insurance_purchase { 
    uint public value;          // 赔偿金额池
    
    address payable public seller;      // 创建合约的就是保险公司，有且只有一个
    address payable public buyer;       // 购买保险的人      
    address payable public hospital;    // 医院方
    
    // 表明一份保险
    struct Insurance {
        uint insurance_id;      // 保险的ID
        bytes32 insurance_name; // 保险的名字
        uint purchase_amount;   // 保险的售价
        uint compensation;      // 保险的赔偿金额
    }    

    // 表明客户购买保险的订单
    struct Order {
        uint insurance_id;      // 保险的ID
        uint purchase_time;     // 保险的购买时间
    }
    
    Insurance[] public insurances;  // 记录所有保险的数组
    
    mapping(address => uint) BuyerHealth;           // 用户所购买的保险是否已经赔付过
    

    mapping(address => Order) insurancesRecord;      // 用户购买的保险号
    
    
    enum State { Created, Locked, Inactive }
    State public state;
    
    
    event Buy_insurance();
    event Get_compensation();
    event Release_compensation();
    
    constructor(
        uint[] memory _insurance_id, 
        bytes32[] memory _insurance_name, 
        uint[] memory _purchase_amount, 
        uint[] memory _compensation
        ) public payable{
        seller = msg.sender;
        require(_insurance_id.length == _insurance_name.length, "Length must be consistent");
        require(_purchase_amount.length == _insurance_name.length, "Length must be consistent");
        require( _purchase_amount.length == _compensation.length, "Length must be consistent");
        for (uint i = 0; i < _insurance_id.length; i++) {
            insurances.push(Insurance({
                insurance_id: _insurance_id[i],
                insurance_name: _insurance_name[i],
                purchase_amount: _purchase_amount[i],
                compensation: _compensation[i]
            }));
        }
        value = msg.value / 2;
        require((2 * value) == msg.value, "Value has to be even.");
    }
    
     modifier inState(State _state) {
        require(
            state == _state,
            "Invalid state."
        );
        _;
    }
    
    modifier onlyBuyer(){
        require(
            msg.sender != seller && msg.sender != hospital,
            "Only buyer can call this."
        );
        _;
    }
    
    modifier onlySeller(){
        require(
            seller == msg.sender,
            "Only seller can call this."
        );
        _;
    }
    
    modifier onlyHospital(){
        require(
            msg.sender == hospital,
            "Only hospital can call this."
        );
        _;
    }
    
    // 保险公司创建新的保险合约，保险id必须不一致
    function CreateInsurance(uint _insurance_id, bytes32 _insurance_name,
        uint _purchase_amount, uint _compensation)
        public 
        onlySeller
    {
        for(uint i = 0; i < insurances.length; i++){
            require(_insurance_id != insurances[i].insurance_id, "The Insurance_id has existed ");
        }
        insurances.push(Insurance({
                insurance_id: _insurance_id,
                insurance_name: _insurance_name,
                purchase_amount: _purchase_amount,
                compensation: _compensation
            }));
    }
    
    // 保险公司确认医院账户，保险的赔付只能在特定医院执行
    function ConfirmHospital(address payable _hospital)
        public
        onlySeller
    {
        hospital = _hospital;
    }
    
    // 所有人都可以通过保险的id查询保险详情
    function GetInsurance(uint _insurance_id)
        public view
        returns (bytes32 insurance_name, uint purchase_amount, uint compensation)
    {
        uint exist_insurance = 0;
        for(uint i = 0; i < insurances.length; i++){
            if(insurances[i].insurance_id == _insurance_id){
                exist_insurance = 1;
                insurance_name = insurances[i].insurance_name;
                purchase_amount = insurances[i].purchase_amount;
                compensation = insurances[i].compensation;
            }
        }
        require(exist_insurance==1,"This insurance does not existed");
    }

    // 保险的限期都是一年，过期后自动销毁用户的保险约定
    function ExpiredInsurance(address _buyer)
    public 
    onlySeller
    returns (bool)
    {

        require(now >= (insurancesRecord[msg.sender].purchase_time + 12 hours),"The insurance is not expired");
        // 过期就删除保险记录
        insurancesRecord[_buyer].insurance_id = 0;
        insurancesRecord[_buyer].purchase_time = 0;
        return true;
    }
    
    // 用户通过保险的id购买保险
    function BuyInsurance(uint _insurance_id)
        public payable
        returns (address add)
    {
        emit Buy_insurance();
        uint exist_insurance = 0;
        buyer = msg.sender;
        add = msg.sender;
        for(uint i = 0; i < insurances.length; i++){
            if(insurances[i].insurance_id == _insurance_id){
                exist_insurance = 1;
                insurancesRecord[msg.sender].insurance_id = _insurance_id;
                // 记录购买的时间
                insurancesRecord[msg.sender].purchase_time = now;
                seller.transfer(insurances[i].purchase_amount);
            }
        }
        require(exist_insurance==1,"This insurance does not existed");
        state = State.Locked;
    }
    
    // 用户取消保险的购买，退款
    function ReturnInsurance(uint _insurance_id)
    public payable
    onlyBuyer
    returns (bool)
    {
        uint exist_insurance = insurances.length+1;
        for(uint i = 0; i < insurances.length; i++){
            if(insurances[i].insurance_id == _insurance_id){
                exist_insurance = i;
            }
        }
        // 判断保险是否存在
        require(exist_insurance!=insurances.length+1,"This insurance does not existed");
        // 判断用户是否已购买该保险
        require(insurancesRecord[buyer].insurance_id == _insurance_id,"The buyer didn't buy this insurance");
        if(insurancesRecord[buyer].insurance_id == _insurance_id){
            insurancesRecord[msg.sender].insurance_id = 0;
            buyer.transfer(insurances[exist_insurance].purchase_amount);
            state = State.Inactive;
            return true;
        }
        else{
            return false;
        }
    }
    
    // 医院根据用户地址来获得保险的赔偿
    function GetCompensation(address patient)
        public payable
        onlyHospital
        inState(State.Locked)
    {
        emit Get_compensation();
        state = State.Inactive;
        require(BuyerHealth[patient] == 0, "The patient had get compensation yet");
        uint _insurance_id = insurancesRecord[patient].insurance_id;
        require(_insurance_id != 0, "The patient hasn't buy any insurance");
        // 将合约的钱转账
        buyer.transfer(address(this).balance);
        BuyerHealth[patient] = 1;
    }
}