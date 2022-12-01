//
//  serviceReducer.js:
//  BoilerPlate
//
//  Created by Retrocube on 10/4/2019, 9:22:21 AM.
//  Copyright © 2019 Retrocube. All rights reserved.
//
import * as types from "../actions/ActionTypes";
import _ from "lodash";
const initialState = {
   isFetching: false,
   failure: false,
   errorMessage: "",
   data: [],
   meta: {}
};
export default type => {
   return (state = initialState, action) => {
      switch (action.type) {
         case type.REQUEST:
            return {
               ...state,
               isFetching: true
            };
         case type.SUCCESS:
            return {
               ...state,
               failure: false,
               isFetching: false,
               errorMessage: "",
               data: action.isConcat ? _.concat(action.data, state.data) : action.data,
               meta: action.meta ?? state.meta
            };
         case type.FAILURE:
            return {
               ...state,
               failure: true,
               isFetching: false,
               errorMessage: action.errorMessage
            };
         case type.UPDATE:
            obj = action.data;

            temp_array = _.cloneDeep(state.data);
            var index = state.data.findIndex((item) => item.id === obj.id);
            // Replace the item by index.
            temp_array.splice(index, 1, obj);
            return { ...state, data: temp_array };
         // case type.UPDATE:
         //    return updateOperation(state, action, type.UPDATE);
         case type.DELETE:
            return deleteOperation(state, action);

         default:
            return state;
      }
   };
};
const updateOperation = (state, action, type) => {
   isArray = Array.isArray(state.data);
   switch (type) {
      default:
         if (action.key && action.path) {
            return {};
         } else {
            if (isArray) {
               return {
                  ...state,
                  data: [...state.data, action.data]
               };
            } else {
               return {
                  ...state,
                  data: { ...state.data, ...action.data }
               };
            }
         }
   }
};
const deleteOperation = (state, action) => {
   isArray = Array.isArray(state.data);
   if (action.key && action.where) {
      if (isArray) {
         const newData = [...state.data];
         const index = state.data.findIndex(
            item => item[action.key] === action.where
         );
         newData.splice(index, 1);
         return {
            ...state,
            data: newData
         };
      } else {
         return state;
      }
   } else {
      return state;
   }
};
//_.result(this.data, "allemp.0.employee_name")
// _.set(this.data, "allemp.1", {
//     id: "16271109",
//     employee_name: "lay",
//     employee_salary: "14555",
//     employee_age: "12",
//     profile_image: ""
// });
