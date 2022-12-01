import React, { useCallback, useState, useEffect } from 'react';
import { ImageBackground, View, Image, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Images, Colors, AppStyles, Metrics } from '../../theme';
import styles from './styles.js';
import { DATA, TOKEN_DETAILS } from './mock_data';
import { BuyTokenCard, TokenDetailsCard } from '../../components';
import { Paragraph, Title } from '../../reuseableComponents/Typography';
import { AppButton, FlashMessage, Loader } from '../../reuseableComponents';
import { useDispatch, useSelector } from 'react-redux'
import {
   useIAP,
   requestSubscription,
   validateReceiptIos,
   withIAPContext,
   initConnection,
} from 'react-native-iap';
import constant from '../../constants';
import { request } from '../../actions/ServiceAction';
import { USER } from '../../actions/ActionTypes';
import { isFan } from '../../reuseableFunctions';

const Index = props => {
   const { route } = props;

   const {
      connected,
      getProducts,
      products,
      finishTransaction,
      currentPurchase,
      currentPurchaseError,
   } = useIAP();


   const user = useSelector(({ user }) => user.data)


   const dispatch = useDispatch();

   const [selected, setSelected] = useState('');
   // const [userData, setUser] = useState(user);
   const onSelect = data => ev => {
      setSelected(data);
   };
   const getProductId = () => {
      const proSkus = Platform.select({
         ios: [
            'com.streammii.tentokens',
            'com.streammii.50Tokens',
            'com.streammii.125Tokens',
            'com.streammii.250Tokens',
            'com.streammii.625Tokens'
         ],
         android: [
            'com.streammii.tentokens',
            'com.streammii.50tokens',
            'com.streammii.125tokens',
            'com.streammii.250tokens',
            // 'com.streammii.625tokens'
         ],
      });
      return proSkus
   };

   function _onBuyProduct() {
      purchaseFullApp(selected);
   }


   useEffect(() => {
      // if (__DEV__) {
      //    initConnection();
      // }
      if (connected) {
         getProducts(getProductId());
      }
   }, [connected, getProducts]);


   useEffect(() => {
      const checkCurrentPurchase = async purchase => {
         console.log('purchase..... ', purchase);
         if (purchase) {
            // if (purchase.productId != getProductId(0)) {
            const receipt = purchase.transactionReceipt;
            let gatewayResponse = '';
            if (receipt) {
               if (Platform.OS === 'ios') {
                  gatewayResponse = await _validateReceiptIos(receipt);
                  console.log('ios purchase.....  ', gatewayResponse);
                  _apiRequest(gatewayResponse, purchase);
               } else if (Platform.OS === 'android') {
                  console.log('android purchase ..... ');
                  gatewayResponse = purchase;
                  _apiRequest(gatewayResponse, purchase);
               }

               try {
                  const ackResult = await finishTransaction(purchase, true);

               } catch (ackErr) {
                  // We would need a backend to validate receipts for purhcases that pended for a while and were then declined. So I'll assume most purchase attempts go through successfully (OK ackResult) & take the hit for the ones that don't (user will still have full app access).
                  console.log('ackError: ', ackErr);
               }
            }
            // }
         }
      };
      checkCurrentPurchase(currentPurchase);
   }, [currentPurchase, finishTransaction]);

   // useEffect(() => {
   //    if (currentPurchaseError) {
   //       if (currentPurchaseError.code === 'E_ALREADY_OWNED') {
   //       }
   //    }
   // }, [currentPurchaseError]);

   const _validateReceiptIos = async receipt => {
      const response = await validateReceiptIos(
         {
            'receipt-data': receipt,
            password: constant.AppSpecificSharedSecret,
            // 'exclude-old-transactions': true,
         },
         false,
      ); //false for live and true for debug

      const { status } = response;

      if (status === 0) {
         const lastIndex = response.latest_receipt_info.length - 1;
         const lastReceipt = response.latest_receipt_info[0];
         return lastReceipt;
      } else {
         return [];
      }
   };

   function _apiRequest(gatewayResponse, purchase) {
      const payload = new FormData();
      payload.append('subscription_package_id', purchase.productId);
      payload.append('gateway_request', JSON.stringify(selected));
      payload.append('gateway_response', JSON.stringify(gatewayResponse));
      payload.append(
         'gateway_type',
         Platform.OS === 'android' ? 'android' : 'ios',
      );

      dispatch(
         request(
            constant.buyToken,
            constant.serviceTypes.POST,
            payload,
            USER,
            true,
            false,
            cbOnSuccess
         )
      );
   }

   const cbOnSuccess = (res, meta, message) => {
      setSelected('')
   }

   const purchaseFullApp = async item => {
      if (!connected) {
         FlashMessage({ message: 'Please check your internet connection' });
      }
      // If we are connected & have subscriptions, purchase the item. Gohas no inteogle will handle if user rnet here.
      else if (products?.length > 0) {
         console.log('Purchasing subscriptions...', item.productId);
         requestSubscription(item.productId);
      }
      // If we are connected but have no subscriptions returned, try to get subscriptions and purchase.
      else {
         console.log('No subscriptions. Now trying to get some...');
         try {
            await getProducts(getProductId());
            requestSubscription(item.productId);
            console.log('Got subscriptions, now purchasing...');
         } catch (error) {
            FlashMessage({ message: 'Please check your internet connection' });
            console.log('Everything failed. Error: ', error);
         }
      }
   };

   const TOKEN_DETAILS = {
      updated_at: new Date(),
      // token: isFan() ? user?.no_of_token_supported : user?.no_of_token_received,
      token: isFan() ? user?.total_coins : user?.total_coins,
   };

   const _renderItem = useCallback(data => {
      return (
         <BuyTokenCard
            key={data.id}
            active={selected}
            onPress={onSelect(data)}
            data={data}
         />
      );
   }, [selected]);

   const isBuyToken = route.params?.isBuyToken ?? null

   products?.sort(function (a, b) {
      return a.price - b.price;
   });

   return (
      <ScrollView contentContainerStyle={AppStyles.listStyle}>
         <ImageBackground
            source={Images.tokenBg}
            resizeMode='stretch'
            style={[AppStyles.percent100,
            { marginTop: isBuyToken ? 0 : Metrics.navBarHeight, }
            ]}>
            {isBuyToken ?
               <>
                  <Title size={20} color={Colors.white} style={styles.title}>
                     Buy Tokens
                  </Title>
                  <Paragraph size={15} style={styles.para}>
                     {"Buy tokens to support your favourite \nartist"}
                  </Paragraph>
               </>
               :
               <View style={styles.tokenDetail}>
                  <TokenDetailsCard data={TOKEN_DETAILS} />
                  <View>
                     <Image style={styles.blurImage} source={Images.blurToken} />
                  </View>
               </View>
            }
            <View
               style={isBuyToken ? styles.containerTwoText : styles.containerTwoCard}>
               {products.length ?
                  <>
                     <ScrollView
                        horizontal={true}
                        contentContainerStyle={{ paddingLeft: 50 }}
                        showsHorizontalScrollIndicator={false}>
                        {products.map(_renderItem)}
                     </ScrollView>
                     <AppButton
                        title="Pay Now"
                        // style={styles.btn}
                        style={selected ? [styles.btn] : [styles.btn, { backgroundColor: 'grey' }]}
                        onPress={() => _onBuyProduct()}
                        disabled={selected ? false : true}
                     />
                  </>
                  : <Loader />}
               {isBuyToken &&
                  <Paragraph style={styles.note} size={12} color={Colors.lynch}>
                     Subscriptions billed as one-time payments. Reccurring billing. Cancel
                     anytime.
                  </Paragraph>
               }
            </View>

         </ImageBackground>
      </ScrollView>

   );
};

export default withIAPContext(Index);