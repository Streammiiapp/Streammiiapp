import React, { useCallback, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Image, ImageBackground, ScrollView, View } from 'react-native';
import _ from 'lodash';

import { TokenCard, TokenDetailsCard } from '../../components';
import {
   Alert,
   AppButton,
   ButtonView,
   FlashMessage,
   FormHandler,
   TextButton,
} from '../../reuseableComponents';
import { Paragraph } from '../../reuseableComponents/Typography';
import { navigate, pop } from '../../services/NavigationService';
import { AppStyles, Colors, Images, Metrics } from '../../theme';
import { DATA, PromoteData, TOKEN_DETAILS } from './mock_data';
import styles from './styles.js';
import { useDispatch, useSelector } from 'react-redux'
import { defaultAction, request } from '../../actions/ServiceAction';
import constant from '../../constants';
import { getUser } from '../../CommonApis';
import { USER } from '../../actions/ActionTypes';
import { isFan } from '../../reuseableFunctions';
import { INPUT_TYPES } from '../../reuseableComponents/FormHandler/constants';
import { useMergeState } from '../../hooks';
import Dropdown from '../../reuseableComponents/Dropdown';

const artistForm = [

   {
      data: [],
      type: INPUT_TYPES.SELECTABLE,
      identifier: 'musicGenre',
      label: 'Music Genre',
      error: 'Select music genre',
      schema: {
         label: 'title',
         value: 'id'
      }
   },
]

const Index = props => {
   const {
      route: { params },
      navigation
   } = props;

   const user = useSelector(({ user }) => user.data)
   const [selected, setSelected] = useState('');
   const [unique, setUnique] = useState('');
   const [receiverId, setReceiver_id] = useState(params.user.id);
   const [postId, setPost_id] = useState(params.id);
   const [userData, setUser] = useState(user);
   const [supportToken, setToken] = useState()
   const [genre, setGenre] = useState(null)
   const [state, setState] = useMergeState({
      form: artistForm
   })


   const { musicTypes } = useSelector((state) => state)


   useEffect(() => {
      const _form = state.form
      _form[0] = { ..._form[0], data: musicTypes.data }

      setState({
         form: _form
      })
   }, [musicTypes.data])

   const dispatch = useDispatch();

   const alertRef = useRef();
   const formRef = useRef(null)

   const onSelect = (value, unique) => {
      global.log("value on select::", value);
      global.log("string on select::", unique);
      setSelected(value);
      setUnique(unique);
   };

   const TOKEN_DETAILS = {
      updated_at: new Date(),
      // token: isFan() ? userData?.no_of_token_supported : userData?.no_of_token_received,
      token: isFan() ? userData?.total_coins : userData?.total_coins,
   };

   useLayoutEffect(() => {
      navigation.setParams({ title: params?.isSupportArtist ? 'Support Artist' : 'Promote Post' })
   }, [])


   const _renderItem = useCallback(
      data => {
         return (
            <TokenCard
               key={data.id}
               active={selected}
               onPress={onSelect}
               data={data}
            />
         );
      },
      [selected],
   );

   const onSupportArtist = async () => {

      let data = await params?.isSupportArtist ? DATA.find(item => item.id === selected) : PromoteData.find(item => item.id === selected);
      setToken(s => data)
      if (TOKEN_DETAILS.token >= data.value && params?.isSupportArtist === true) {

         alertRef.current.setMessage(
            `Are you sure you want to support “${params.user.name}” with ${data.value} tokens`
         );
         alertRef.current.show();

      } else if (TOKEN_DETAILS.token >= data.value && params?.isSupportArtist === false) {
         if (data.value === 125) {
            const formdata = formRef.current.submitForm()
            if (formdata) {

               const payload = {
                  music_genres_id: formdata.musicGenre,
                  promotion_status: data.status,
                  value: data.value
               }
               setGenre(payload);
               alertRef.current.setMessage(
                  `Are you sure you want to promote this post with ${data.value} tokens`,
               );
               alertRef.current.show();
            }
         } else if (data.value === 50) {
            const payload = {
               music_genres_id: 0,
               promotion_status: data.status,
               value: data.value
            }
            setGenre(payload);
            alertRef.current.setMessage(
               `Are you sure you want to promote this post with ${data.value} tokens`,
            );
            alertRef.current.show();
         }

      } else {
         navigate('BuyTokens', { isBuyToken: true });
      }
   };

   const _onConfirmToken = () => {
      if (params?.isSupportArtist === false) {
         setGenre(g => {
            let paramsPromote = {
               music_genres_id: g.music_genres_id,
               promotion_status: g.promotion_status,
               post_id: postId,

            }
            dispatch(
               request(
                  constant.PromoteArtist,
                  constant.serviceTypes.POST,
                  paramsPromote,
                  null,
                  true,
                  false,
                  cbOnSuccess
               )
            );
            alertRef.current.hide();
            return g
         })
      } else {
         setToken(s => {
            let params = {
               receiver_id: receiverId,
               post_id: postId,
               coins: s.value,

            }
            dispatch(
               request(
                  constant.supportArtist,
                  constant.serviceTypes.POST,
                  params,
                  null,
                  true,
                  false,
                  cbOnSuccess
               )
            );
            alertRef.current.hide();
            return s
         })
      }
   }

   const cbOnSuccess = (res, meta, message) => {
      const tempUsr = _.cloneDeep(user);
      tempUsr.total_coins = res.total_coins;
      dispatch(defaultAction(USER.SUCCESS, tempUsr))

      if (params?.isSupportArtist === false) {
         setGenre(g => {
            FlashMessage({
               message: `you have successfully Promote the post with ${g.value} tokens`, type: 'success'
            })
            pop()

            return g
         })
      } else {
         setToken(s => {
            FlashMessage({
               message: `you have successfully supported “${params.user.name}” with ${s.value} tokens`, type: 'success'
            })
            pop()

            return s
         })
      }



   }

   const renderForm = (item, index) => {

      if (item.type == INPUT_TYPES.SELECTABLE) {
         return (
            <Dropdown
               key={item.identifier}
               identifier={item.identifier}
               placeholder={item.label}
               data={item.data}
               schema={item.schema}
               type={item.type}
               error={item.error}
            />
         );
      }
   };



   return (
      <ScrollView contentContainerStyle={AppStyles.listStyle}>
         <View style={styles.containerOne}>
            <ImageBackground source={Images.bgTokenScreen} style={styles.mainBg}>
               <TokenDetailsCard data={TOKEN_DETAILS} />
               <View>
                  <Image style={styles.blurImage} source={Images.blurToken} />
               </View>
            </ImageBackground>
         </View>
         <View style={styles.containerTwo}>
            {
               params?.isSupportArtist ?
                  DATA.map(_renderItem) :
                  PromoteData.map(_renderItem)

            }
            {
               unique == "125 Tokens promote" ?
                  <View style={{ marginHorizontal: Metrics.baseMargin }}>
                     <FormHandler ref={formRef}>
                        {state.form.map(renderForm)}
                     </FormHandler>
                  </View>
                  : null}
            <AppButton
               title={params?.isSupportArtist ? "Support Artist" : "Promote Post"}
               style={selected ? [styles.btn] : [styles.btn, { backgroundColor: 'grey' }]}
               onPress={onSupportArtist}
               disabled={selected ? false : true}
            />
            <TextButton
               underline
               title="Buy More Tokens"
               textColor={Colors.theme}
               style={{ alignSelf: 'center' }}
               onPress={() => navigate('BuyTokens', { isBuyToken: true })}
            />
         </View>
         <Alert title="Thank you" isChoiceAlert={false} ref={alertRef} onRightPress={_onConfirmToken} />
      </ScrollView>
   );
};

export default Index;
