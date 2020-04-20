const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');


//hangi ağa bağlanacağını provider ile veriyoruz.
//ganache cli ile bağlandığımı
const provider = ganache.provider();
const web3 = new Web3(provider);

const {interface, bytecode} = require('../compile');


//testlerden önce çalışacak beforeEach'de kullanılacak değişkenleri dışarıda let kullanarak tanımlıyoruz.
let accounts;
let inbox;

//bütün testlerden önce çalışacak blok
beforeEach(async ()=>{
    //bütün hesapların listesini al
    accounts = await web3.eth.getAccounts();
    
    //bu hesaplardan birini kullanarak contract'ı deploy et
   inbox = await  new web3.eth.Contract(JSON.parse(interface))
        .deploy({data:bytecode,arguments:['Hi there']})
        .send({from:accounts[0],gas:'1000000'});
    
    inbox.setProvider(provider);

});

describe('Inbox',()=>{
    it('should have an address',()=>{
       assert.ok(inbox.options.address);
    });

    it('should have a default message', async ()=>{
        const message = await inbox.methods.message().call();
        assert.equal(message,'Hi there');
    });

    it('should modify message', async ()=>{
        await inbox.methods.setMessage('new Message').send({from:accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message, 'new Message');
    });

});
