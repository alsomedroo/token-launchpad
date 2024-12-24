import {MINT_SIZE, getMinimumBalanceForRentExemptMint, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair , SystemProgram, Transaction } from "@solana/web3.js";
import { createInitializeMint2Instruction } from "@solana/spl-token";




export function TokenLaunchpad() {

    const wallet = useWallet()
    const {connection} = useConnection()
    async function createtok(){
        // const name = document.getElementById('name').value;
        // const symbol = document.getElementById('symbol').value;
        // const image = document.getElementById('image').value;
        // const initialSupply = document.getElementById('initialSupply').value;

        //createMint()
        const lamports = await getMinimumBalanceForRentExemptMint(connection)
        const keypair = Keypair.generate();
        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: keypair.publicKey,
                space: MINT_SIZE,
                lamports,
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMint2Instruction(keypair.publicKey, 6, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID),
        );

        const recentblockhash = await connection.getLatestBlockhash()
        transaction.recentBlockhash = recentblockhash.blockhash
        transaction.feePayer = wallet.publicKey

        transaction.partialSign(keypair)
        let response = await wallet.sendTransaction(transaction,connection)
        console.log(response)
    

    }
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <h1>Solana Token Launchpad</h1>
            {/* <input className='inputText' type='text' placeholder='Name' /> <br />
            <input className='inputText' type='text' placeholder='Symbol' /> <br />
            <input className='inputText' type='text' placeholder='Image URL' /> <br />
            <input className='inputText' type='text' placeholder='Initial Supply' /> <br /> */}
            <button onClick={createtok} className='btn'>Create a token</button>
        </div>
        
    );
}
