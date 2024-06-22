/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import {Asset} from './asset';

@Info({title: 'AssetTransfer', description: 'Smart contract for trading assets'})
export class AssetTransferContract extends Contract {

    @Transaction()
    public async InitLedger(ctx: Context): Promise<void> {
        // const assets: Asset[] = [
        //     {
        //         ID: 'asset1',
        //         UserId: 1,
        //         FirstName: 'ss',
        //         LastName: 'ddd',    
        //         Hospital: 'UWM',
        //         Data: 'retertretre',
        //         IsDeleted: false,
        //         IsEdited: 0,
        //         ParentId: null,
        //         Version: 1,
        //         Description: 'First try of data',
        //         CreatedAt: '2024-01-01 20:21',
        //     },
        //     {
        //         ID: 'asset2',
        //         UserId: 2,
        //         FirstName: 'rtyeyrey',
        //         LastName: 'swaewaq',    
        //         Hospital: 'UWM',
        //         Data: 'bvnmm,,,',
        //         IsDeleted: false,
        //         IsEdited: 0,
        //         ParentId: null,
        //         Version: 1,
        //         Description: 'First try of data',
        //         CreatedAt: '2024-01-01 20:21',
        //     },
        //     {
        //         ID: 'asset3',
        //         UserId: 3,
        //         FirstName: 'hgjgf',
        //         LastName: 'bnbnbn',    
        //         Hospital: 'UWM',
        //         Data: 'uty76yy',
        //         IsDeleted: false,
        //         IsEdited: 0,
        //         ParentId: null,
        //         Version: 1,
        //         Description: 'First try of data',
        //         CreatedAt: '2024-01-01 20:21',
        //     },
        //     {
        //         ID: 'asset4',
        //         UserId: 14,
        //         FirstName: 'ikllklk',
        //         LastName: 'vcfg',    
        //         Hospital: 'UWM',
        //         Data: 'kjlkjlkj',
        //         IsDeleted: false,
        //         IsEdited: 0,
        //         ParentId: null,
        //         Version: 1,
        //         Description: 'First try of data',
        //         CreatedAt: '2024-01-01 20:21',
        //     },
        //     {
        //         ID: 'asset5',
        //         UserId: 15,
        //         FirstName: 'eeee',
        //         LastName: 'ffff',    
        //         Hospital: 'UWM',
        //         Data: 'ssdd',
        //         IsDeleted: false,
        //         IsEdited: 0,
        //         ParentId: null,
        //         Version: 1,
        //         Description: 'First try of data',
        //         CreatedAt: '2024-01-01 20:21',
        //     },
        //     {
        //         ID: 'asset6',
        //         UserId: 16,
        //         FirstName: 'eeeeee',
        //         LastName: 'ddd',    
        //         Hospital: 'UWM',
        //         Data: 'sss',
        //         IsDeleted: false,
        //         IsEdited: 0,
        //         ParentId: null,
        //         Version: 1,
        //         Description: 'First try of data',
        //         CreatedAt: '2024-01-01 20:21',
        //     },
        // ];

        // for (const asset of assets) {
        //     asset.docType = 'asset';
        //     // example of how to write to world state deterministically
        //     // use convetion of alphabetic order
        //     // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        //     // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
        //     await ctx.stub.putState(asset.ID, Buffer.from(stringify(sortKeysRecursive(asset))));
        //     console.info(`Asset ${asset.ID} initialized`);
        // }
    }

       // CreateAsset issues a new asset to the world state with given details.
       @Transaction()
       public async CreateAsset(
           ctx: Context, 
           id: string, 
           userid: number, 
           firstname: string, 
           lastname: string, 
           hospital: string, 
           data: string, 
           parentId: string | null, 
           version: number,
           description: string
       ): Promise<void> {
           let exists = await this.AssetExists(ctx, id);
           while (exists) {
               id = this.generateRandomId(); // Generate a new random ID if the asset ID already exists
               exists = await this.AssetExists(ctx, id);
           }
       
           const currentDate = new Date();
           const offset = 8; // UTC+8
           const utc = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000); // UTC time in ms
           const serverDate = new Date(utc + (3600000 * offset));
           
           const formattedDate = `${serverDate.getFullYear()}-${(serverDate.getMonth() + 1).toString().padStart(2, '0')}-${serverDate.getDate().toString().padStart(2, '0')} ${serverDate.getHours()}:${serverDate.getMinutes().toString().padStart(2, '0')}`;
           
           const asset = {
               ID: id,
               UserId: userid,
               FirstName: firstname,
               LastName: lastname,    
               Hospital: hospital,
               Data: data,
               IsDeleted: false,
               IsEdited: 0,
               ParentId: parentId ?? '',
               Version: version,
               Description: description,
               CreatedAt: formattedDate,
           };
       
           await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
       
           if (parentId != '' && parentId != null) {
               const parentAssetString = await this.ReadAsset(ctx, parentId);
               const parentAsset: Asset = JSON.parse(parentAssetString);
               parentAsset.IsEdited = 1;
               await ctx.stub.putState(parentId, Buffer.from(stringify(sortKeysRecursive(parentAsset))));
           }
       }
   
       // Helper function to generate a random ID
       private generateRandomId(): string {
           const randomId = Math.random().toString(36).substr(2, 9); // Generate a random alphanumeric string
           return `${randomId}`;
       }

    // ReadAsset returns the asset stored in the world state with given id.
    @Transaction(false)
    public async ReadAsset(ctx: Context, id: string): Promise<string> {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    @Transaction()
    public async UpdateAsset(ctx: Context, id: string, userid: number, firstname: string, lastname: string, hospital: string, data: string): Promise<void> {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset = {
            ID: id,
            UserId: userid,
            FirstName: firstname,
            LastName: lastname,    
            Hospital: hospital,
            Data: data,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    }

    // DeleteAsset deletes an given asset from the world state.
    @Transaction()
    public async DeleteAsset(ctx: Context, id: string): Promise<void> {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        asset.IsDeleted = !asset.IsDeleted;
        return await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
    }

    // AssetExists returns true when asset with given ID exists in world state.
    @Transaction(false)
    @Returns('boolean')
    public async AssetExists(ctx: Context, id: string): Promise<boolean> {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state, and returns the old owner.
    @Transaction()
    public async TransferAsset(ctx: Context, id: string, newOwner: string): Promise<string> {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        const oldOwner = asset.Owner;
        asset.Owner = newOwner;
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return oldOwner;
    }

    // GetAllAssets returns all assets found in the world state.
    @Transaction(false)
    @Returns('string')
    public async GetAllAssets(ctx: Context): Promise<string> {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
    

}