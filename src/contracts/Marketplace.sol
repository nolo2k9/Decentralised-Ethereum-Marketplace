pragma solidity ^0.5.0; 

contract Marketplace {
    //declaring state variables
    string public name; 
    uint public productCount = 0;  
    mapping(uint => Product) public products;

    //data struct
    struct Product{
        uint id;
        string name;
        uint price;
        address owner;
        bool purchased;

    }//struct

    //product created event
    event ProductCreated(
        uint id,
        string name,
        uint price,
        address owner,
        bool purchased

    );//productcreated

    constructor() public {
        name = "ETH Marketplace";
        
    }//constructor

    //_name (convention) this says that these are local and not state variables
    function createProduct(string memory _name, uint _price) public {
        //require a name
        require(bytes(_name).length > 0);
        //require a price
        require(_price > 0);
        // increment product count
        productCount ++;

        //create product
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        //trigger an event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);

    }//createProduct

}//Marketplace