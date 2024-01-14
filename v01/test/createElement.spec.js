import {expect,test} from 'vitest'
import React from '../src/React.js'

test("should be a vdom",()=>{
    const el = React.createElement("div",{id:"test"},"hello~");
    const el_ = React.createElement("div",null,"test");
    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "textContent": "hello~",
              },
              "type": "TEXT_NODE",
            },
          ],
          "id": "test",
        },
        "type": "div",
      }
    `);
    expect(el_).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "textContent": "test",
              },
              "type": "TEXT_NODE",
            },
          ],
        },
        "type": "div",
      }
    `);
    // expect(el).toEqual({
    //     type:"div",
    //     props:{
    //         id:"test",
    //         children:[{
    //             type:"TEXT_NODE",
    //             props:{
    //                 textContent:"hello~",
    //                 children:[]
    //             }
    //         }]
    //     }
    // })
})