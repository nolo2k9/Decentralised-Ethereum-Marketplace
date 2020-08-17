const { assert } = require("chai")
const { default: Web3 } = require("web3")
require('chai')
   .use(require('chai-as-promised'))
   .should()


const Marketplace = artifacts.require('./Marketplace.sol')

contract('Marketplace', ([deployer, seller, buyer]) => {
    let marketplace 

    before(async ()=>
    {
        marketplace = await Marketplace.deployed()
    })

    describe('deployment', async() => {
        it('deploys successfully', async () => {

            const address = await marketplace.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)

        })
        it('has a name', async() => {
            const name = await marketplace.name()
            assert.equal(name, 'ETH Marketplace')
        })
        
    })

    describe('products', async() => {
        let result, productCount

        before(async ()=>{
        //The value if the phone is expressed as 1 full ether in wei
        // telling solidaty msg.sender is the seller
        result = await marketplace.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), {from: seller})
        productCount = await marketplace.productCount()
    })

    it('creates products', async() => {
        //SUCCESS
        assert.equal(productCount, 1)
        const event = result.logs[0].args
        //making sure product count is incremeted 
        assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
        //making sure product name is correct
        assert.equal(event.name,'iPhone X' , 'name is correct')
         //making sure product price is correct
        assert.equal(event.price,'1000000000000000000' , 'price is correct')
        //making sure product seller is correct
        assert.equal(event.owner, seller , 'owner is correct')
        //making sure product purchased is correct
        assert.equal(event.purchased,false , 'purchased is correct')

       //FAILURE: Product must have a name
       //rejecting if product doesnt have a name
       await await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), {from: seller}).should.be.rejected
       //rejecting if product doesnt have a price
       await await marketplace.createProduct('iPhone X',0, {from: seller}).should.be.rejected


    })
    it('lists products', async() => {
        //get list of products from products and pass in product count
        const product = await marketplace.products(productCount)
        assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
        //making sure product name is correct
        assert.equal(product.name,'iPhone X' , 'name is correct')
         //making sure product price is correct
        assert.equal(product.price,'1000000000000000000' , 'price is correct')
        //making sure product seller is correct
        assert.equal(product.owner, seller , 'owner is correct')
        //making sure product purchased is correct
        assert.equal(product.purchased,false , 'purchased is correct')

    })

    it('sells products', async() => {
        //Track the seller balance before purchase
        let oldSellerBalance
        oldSellerBalance = await web3.eth.getBalance(seller)
        oldSellerBalance = new web3.utils.BN(oldSellerBalance)
        //Success: buyer can make a purchase
        result = await marketplace.purchaseProduct(productCount, {from:buyer, value: web3.utils.toWei('1', 'Ether')})

        //Check logs
        const event = result.logs[0].args
        //making sure product count is incremeted 
        assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
        //making sure product name is correct
        assert.equal(event.name,'iPhone X' , 'name is correct')
         //making sure product price is correct
        assert.equal(event.price,'1000000000000000000' , 'price is correct')
        //making sure product seller is correct
        assert.equal(event.owner, buyer , 'owner is correct')
        //making sure product purchased is correct
        assert.equal(event.purchased,true , 'purchased is correct')

        //Ensure seller recieves funds
        let newSellerBalance 
        newSellerBalance = await web3.eth.getBalance(seller)
        newSellerBalance = new web3.utils.BN(newSellerBalance)

        let price
        price = web3.utils.toWei('1', 'Ether')
        price = new web3.utils.BN(price)

        const expectedBalance = oldSellerBalance.add(price)

        assert.equal(newSellerBalance.toString(), expectedBalance.toString())
        //console.log(oldSellerBalance, newSellerBalance, price)

        //FAILURE: Try to buy a product that doesn not exist (invalid id)
        await marketplace.purchaseProduct(99, {from:buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
        //FAILURE: Try to buy a product without the required amount of ether
        await marketplace.purchaseProduct(99, {from:buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected;
        //FAILURE: Try to buy a product twice from a third party
        await marketplace.purchaseProduct(99, {from:deployer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
        //FAILURE: Buyer cannot be the seller
        await marketplace.purchaseProduct(99, {from:buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
        

    })
    

        
    })
})