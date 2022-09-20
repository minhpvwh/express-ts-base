import express from "express";

export interface CRUDdemo {
    list: (req: express.Request, _: any) => Promise<any>;
    create: (resource: any) => Promise<any>;
    updateById: (id: string, resource: any) => Promise<string>;
    readById: (id: string) => Promise<any>;
    deleteById: (id: string) => Promise<string>;
    patchById: (id: string, resource: any) => Promise<string>;
}

export interface CRUD {
    getAll: (req: express.Request, _: any) => Promise<any>;
    create: (resource: any) => Promise<any>;
    update: (id: string, resource: any) => Promise<string>;
    get: (query: any, _: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
}
