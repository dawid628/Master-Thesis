"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetTransferContract = void 0;
/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
const fabric_contract_api_1 = require("fabric-contract-api");
const json_stringify_deterministic_1 = __importDefault(require("json-stringify-deterministic"));
const sort_keys_recursive_1 = __importDefault(require("sort-keys-recursive"));
let AssetTransferContract = class AssetTransferContract extends fabric_contract_api_1.Contract {
    async InitLedger(ctx) {
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
    async CreateAsset(ctx, id, userid, firstname, lastname, hospital, data, parentId, version, description) {
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
            ParentId: parentId !== null && parentId !== void 0 ? parentId : '',
            Version: version,
            Description: description,
            CreatedAt: formattedDate,
        };
        await ctx.stub.putState(id, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(asset))));
        if (parentId != '' && parentId != null) {
            const parentAssetString = await this.ReadAsset(ctx, parentId);
            const parentAsset = JSON.parse(parentAssetString);
            parentAsset.IsEdited = 1;
            await ctx.stub.putState(parentId, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(parentAsset))));
        }
    }
    // Helper function to generate a random ID
    generateRandomId() {
        const randomId = Math.random().toString(36).substr(2, 9); // Generate a random alphanumeric string
        return `${randomId}`;
    }
    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }
    // UpdateAsset updates an existing asset in the world state with provided parameters.
    async UpdateAsset(ctx, id, userid, firstname, lastname, hospital, data) {
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
        return ctx.stub.putState(id, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(updatedAsset))));
    }
    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, id) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        asset.IsDeleted = !asset.IsDeleted;
        return await ctx.stub.putState(id, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(asset))));
    }
    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
    // TransferAsset updates the owner field of asset with given id in the world state, and returns the old owner.
    async TransferAsset(ctx, id, newOwner) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        const oldOwner = asset.Owner;
        asset.Owner = newOwner;
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(asset))));
        return oldOwner;
    }
    // GetAllAssets returns all assets found in the world state.
    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            }
            catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
};
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], AssetTransferContract.prototype, "InitLedger", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, Number, String, String, String, String, String, Number, String]),
    __metadata("design:returntype", Promise)
], AssetTransferContract.prototype, "CreateAsset", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AssetTransferContract.prototype, "ReadAsset", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AssetTransferContract.prototype, "UpdateAsset", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AssetTransferContract.prototype, "DeleteAsset", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    (0, fabric_contract_api_1.Returns)('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AssetTransferContract.prototype, "AssetExists", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], AssetTransferContract.prototype, "TransferAsset", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    (0, fabric_contract_api_1.Returns)('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], AssetTransferContract.prototype, "GetAllAssets", null);
AssetTransferContract = __decorate([
    (0, fabric_contract_api_1.Info)({ title: 'AssetTransfer', description: 'Smart contract for trading assets' })
], AssetTransferContract);
exports.AssetTransferContract = AssetTransferContract;
//# sourceMappingURL=assetTransfer.js.map