import express from "express";

export const exportParams = (req: express.Request) => {
    let query: any = {};
    let params: any = {
        page: 0,
        size: 20,
        fields: '',
        sorts: '',
        order_by: ''
    };
    params = {...params, ...req.query}
    let page = 0;
    let size = 20;
    let fields = '-__v';
    let sorts: any = {};
    let options: any = {};
    if (params['page']) {
        page = +params['page'];
    }
    delete params['page'];
    if (params['size']) {
        size = +params['size'];
    }
    delete params['size'];
    if (size > 0) {
        options = {
            limit: size,
            skip: size * page
        };
    }
    if (params['fields']) {
        fields = params['fields'];
    }
    delete params['fields'];
    if (params['sorts'] !== '') {
        for (const s of params['sorts'].split(',')) {
            if (s.startsWith('-') && s.length > 1) {
                // @ts-ignore
                params[s.slice(1)] = -1;
            }
            if (s.startsWith('+') && s.length > 1) {
                // @ts-ignore
                params[s.slice(1)] = 1;
            }
        }
    }
    delete params['sorts'];
    if (params['order_by'] !== '') {
        if (params['order_by'].endsWith('_asc') && params['order_by'].length > 1) {
            // @ts-ignore
            var prop = params['order_by'].slice(0, params['order_by'].indexOf('_asc'));
            sorts[prop] = 1;
        }else if (params['order_by'].endsWith('_desc') && params['order_by'].length > 1) {
            // @ts-ignore
            var prop = params['order_by'].slice(0, params['order_by'].indexOf('_desc'));
            sorts[prop] = -1;
        } else {
            // @ts-ignore
            sorts._id = -1;
        }
    } else {
         // @ts-ignore
         sorts._id = -1;
    }
    delete params['order_by'];
    query = params;
    return {query, fields, page, size, sorts, options};
};

export const isEmpty = (data: any) => {
    if (typeof (data) === 'object') {
        if (JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]') {
            return true;
        } else if (!data) {
            return true;
        }
        return false;
    } else if (typeof (data) === 'string') {
        return !data.trim();
    } else return typeof (data) === 'undefined';
};
