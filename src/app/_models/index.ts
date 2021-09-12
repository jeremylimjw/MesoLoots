export interface Page {
    _id: string;
    name: string;
    private: boolean;
    password?: string;
    team: Member[];
    loots: Loot[],
    createdAt: Date;
}

export interface Member {
    _id: string;
    name: string;
    distributableLoots: MongoId[];
    claimedLoots: MongoId[];
    jobId: number;
    createdOn: Date;
    lastClaimed?: Date;
}

export interface Loot {
    _id?: string;
    party: MongoId[];
    itemId: number;
    bossId: number;
    droppedOn: Date;
    soldOn?: Date;
    soldPrice?: number;
    distributable?: number;
    claimedOn?: Date;
}

export interface Boss {
    id: string | number;
    name: string;
    iconUrl: string;
}

export interface Item {
    id: number;
    name: string;
    type: string;
    iconUrl: string;
    imageUrl: string;
    droppedByIds: number[];
    keyword: string;    
}

export interface Job {
    id: string | number;
    name: string;
    category: string;
    imageUrl: string;
}

export interface MongoId {
    _id: string;
}