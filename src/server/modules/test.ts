import { parse } from "parse5";

export class test {
    public parseIt(html: string): string {
       
        const document = parseFragment('<!DOCTYPE html><html><head></head><body>Hi there!</body></html>');
        return document.childNodes[1].childNodes[1].childNodes;
    }
}