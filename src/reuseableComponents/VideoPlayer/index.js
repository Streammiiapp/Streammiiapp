import React, { useEffect, useRef, useState } from 'react'
import {
   Pressable, Animated, Easing,
   ActivityIndicator,
   Text,
   View
} from 'react-native'
import styles from './styles';
import VideoOptions from './VideoOptions';
import { useSelector } from 'react-redux';
import { Colors, Fonts } from '../../theme';
import MediaPlayer from './../MediaPlayer'
import moment from 'moment';

const index = (props) => {

   const { source, poster, id, name } = props
   const stateRef = useRef()
   const animatedOpacity = useRef(new Animated.Value(1)).current
   const video = useSelector(({ videoReducer }) => videoReducer.data?.[name]?.[id])

   const [state, setState] = useState({
      paused: true,
      muted: false,
      isEnd: false,
      isBuffering: false,
      isReady: false,
      duration: "00:00"
   })

   useEffect(() => {
      if (video) {
         if (video.paused) {
            updateState({ paused: true })
         } else {
            updateState({ paused: false })
         }
      }
   }, [video])

   useEffect(() => {
      stateRef.current = state
   }, [state])

   const updateState = (newValues) => {
      setState(s => ({ ...s, ...newValues }))
   }

   const onMute = () => {
      Animated.timing(animatedOpacity, {
         toValue: 1,
         duration: 200,
         easing: Easing.linear,
         useNativeDriver: true,
      }).start();
      updateState({ muted: !state.muted })
      hideControls()
   }

   const hideControls = () => {
      setTimeout(() => {
         Animated.timing(animatedOpacity, {
            toValue: 0,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: true,
         }).start();
      }, 3000);
   }

   const onEnd = () => updateState({ isEnd: true })

   const onBuffer = (buffer) => {
      if (stateRef.current.isBuffering != buffer.isBuffering) {
         updateState({ isBuffering: buffer.isBuffering })
      }
   }

   const onReady = () => {
      // updateState({ isReady: true })
   }
   const progress = (e) => {
      secondsToHms(parseInt(e.seekableDuration), parseInt(e.currentTime))
   }

   function secondsToHms(seekableDuration, currentTime) {
      cTime = Number(currentTime);
      let difference = seekableDuration - cTime;
      difference = moment
         .unix(parseInt(difference))
         .format('mm:ss')

      updateState({ duration: difference })
   }

   return (
      <Pressable onPress={onMute} style={styles.container}>

         <Animated.View style={[styles.controlsWrapper, { opacity: animatedOpacity }]}>
            <VideoOptions
               onMute={onMute}
               muted={state.muted}
            />
         </Animated.View>
         <View style={{ position: 'absolute', zIndex: 999, right: 10 }}>
            <Text style={{ ...Fonts.SemiBold(13), paddingRight: 10, marginTop: 10 }}>{state.duration}</Text>
         </View>
         {
            state.paused == false && (state.isBuffering == true) &&
            (
               <ActivityIndicator color={Colors.white} size='small' style={styles.loader} />
            )
         }
         <MediaPlayer
            source={source}
            poster={poster}
            paused={state.paused}
            muted={state.muted}
            onEnd={onEnd}
            onBuffer={onBuffer}
            onReady={onReady}
            onProgress={progress}
         />
      </Pressable>
   )
}

export default index
