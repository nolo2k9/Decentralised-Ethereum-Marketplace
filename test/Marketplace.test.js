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
        
    })
})