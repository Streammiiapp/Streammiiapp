import React, { PureComponent } from 'react';
import {
   getKeyboardType,
   isInputValid,
   isSecureTextEntry,
   getError,
} from './Utils';
import { INPUT_TYPES } from './Constants';

class Form extends PureComponent {
   childReferences = [];
   childDetails = [];

   /* go through each input and check validation based on its type */
   checkValidation = () => {
      let isValid = true;
      for (let i = 0; i < this.childReferences.length; i++) {
         if (
            this.childReferences[i].getValue &&
            !isInputValid(
               this.childReferences[i].getValue(),
               this.childDetails[i].type,
               this.childDetails[i].type === INPUT_TYPES.CONFIRM_PASSWORD
                  ? this.childReferences[i - 1].getValue()
                  : '',
            )
         ) {
            this.childReferences[i].setError &&
               this.childReferences[i].setError(
                  true,
                  getError(
                     this.childDetails[i].type,
                     this.childReferences[i].getValue(),
                     this.childDetails[i].error,
                  ),
               );
            isValid = false;
         }
      }
      return isValid;
   };

   /* collecting user entered values from all inputs */
   getValues = () => {
      let data = {};
      this.childReferences.forEach((item, index) => {
         data[this.childDetails[index].identifier] = item.getValue();
      });
      return data;
   };

   onSubmitForm = () => {
      return this.checkValidation() ? this.getValues() : undefined;
   };

   refCollector = ref => {
      ref && this.childReferences.push(ref);
   }

   collectChildDetails = childProps =>
      this.childDetails.push({
         identifier: childProps.identifier,
         type: childProps.type,
         error: childProps.error,
      });

   /* handling onSubmit of each input when user moves to next input from keyboard */
   onSubmitEditing = index => ev => {

      if (
         index < this.childReferences.length - 1 &&
         this.childReferences[index + 1].setFocus
      ) {
         this.childReferences[index + 1].setFocus();
      }
   };

   render() {
      const wrappedChildrens = [];
      this.childReferences = []
      React.Children.map(this.props.children, (child, index) => {
         if (!child) {
            return;
         }
         /* holding details of input in an array for later user */
         this.collectChildDetails(child.props);

         /* cloning children and injecting some new props on them */
         wrappedChildrens.push(
            React.cloneElement(child, {
               key: child.props.identifier || `${child.props.type}_${index}`,
               ref: this.refCollector,
               onSubmitEditing: this.onSubmitEditing(index),
               returnKeyType:
                  index < this.props.children.length - 1 ? 'next' : 'done',
               keyboardType: getKeyboardType(child.props),
               secureTextEntry: isSecureTextEntry(child.props),
            }),
         );
      });

      return wrappedChildrens;
   }
}

export default Form;
