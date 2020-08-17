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
        address payable owner;
        bool purchased;

    }//struct

    //product created event
    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased

    );//productcreated

    //Event for purchasing a product
    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased

    );//productcreated

    constructor() public {
        name = "ETH Marketplace";
        
    } //constructor

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

    } //createProduct

    //function to enable purchasing of products
    //payable allows function to make payments with ether
    function purchaseProduct(uint _id) public payable{
        /*
        Get product
        instantiating a new product
        Putting it in memory and assigning it to a new _product variable
        Get it from products mapping 
        */
        Product memory _product = products[_id];
        //get owner
        address payable _seller = _product.owner;
        //ensure product id is valid 
        require(_product.id > 0 && _product.id <= productCount);
        // Require there is enough ether to complete transaction
        require(msg.value >=_product.price);
        //Ensure the product has not been purchased already
        require(!_product.purchased);
        //ensure the buyer is not the seller
        require(_seller != msg.sender);

        //Purchase product
        _product.owner = msg.sender;
        //Mark as purchased
        _product.purchased = true;
        //Update the product
        products[_id] = _product;
        // Pay seller with Ether
        address(_seller).transfer(msg.value);

        //trigger event
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);

    }

} //Marketplace