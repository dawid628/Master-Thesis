import { Context, Contract } from 'fabric-contract-api';
export declare class AssetTransferContract extends Contract {
    InitLedger(ctx: Context): Promise<void>;
    CreateAsset(ctx: Context, id: string, userid: number, firstname: string, lastname: string, hospital: string, data: string, parentId: string | null, version: number, description: string): Promise<void>;
    private generateRandomId;
    ReadAsset(ctx: Context, id: string): Promise<string>;
    UpdateAsset(ctx: Context, id: string, userid: number, firstname: string, lastname: string, hospital: string, data: string): Promise<void>;
    DeleteAsset(ctx: Context, id: string): Promise<void>;
    AssetExists(ctx: Context, id: string): Promise<boolean>;
    TransferAsset(ctx: Context, id: string, newOwner: string): Promise<string>;
    GetAllAssets(ctx: Context): Promise<string>;
}
