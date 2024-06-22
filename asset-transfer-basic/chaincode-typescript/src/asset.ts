/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';

@Object()
export class Asset {
    @Property()
    public docType?: string;

    @Property()
    public ID: string;

    @Property()
    public UserId: number;

    @Property()
    public FirstName: string;

    @Property()
    public LastName: string;

    @Property()
    public Hospital: string;

    @Property()
    public Data: string;

    @Property()
    public IsDeleted: boolean;

    @Property()
    public IsEdited: number;

    @Property()
    public ParentId?: string;

    @Property()
    public Version: number;

    @Property()
    public Description: string;

    @Property()
    public CreatedAt: string;
}