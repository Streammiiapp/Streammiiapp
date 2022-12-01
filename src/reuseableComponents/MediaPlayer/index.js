import React, { useCallback, memo, forwardRef, useContext } from 'react'
import { Metrics } from '../../theme'
import Video from 'react-native-fast-video';
import { PostContext } from '../../contexts';
import { adjustSize } from '../../reuseableFunctions';

const MediaPlayer = forwardRef((props, ref) => {

   const {
      source, onEnd, style,
      muted, paused, height, width,
      name,
      onBuffer, onReady, resizeMode, onProgress, ...rest
   } = props
   const {
      post_meta_data,
      videoHeight,
      isTiktok,
      post_type
   } = useContext(PostContext)



   const { width: videoWidthBack, height: videoHeightBack } = JSON.parse(post_meta_data)


   const { computedWidth, computedHeight } = adjustSize(videoWidthBack ?? 400, videoHeightBack ?? 400, videoHeight)


   return (
      <Video
         {...rest}
         ref={ref}
         source={{ uri: source }}
         paused={paused}
         repeat={true}
         muted={muted}
         volume={1.0}
         onEnd={onEnd}
         onBuffer={onBuffer}
         onReadyForDisplay={onReady}
         resizeMode={resizeMode}
         ignoreSilentSwitch={'ignore'}
         // controls={true}
         onProgress={onProgress}
         style={[style, { height: isTiktok == true && post_type != 'audio' ? computedHeight : height, width: isTiktok == true && post_type != 'audio' ? computedWidth : width }]}
      // style={[style, { height, width }]}
      />
   )
})

const propsAreEqual = (prevProps, nextProps) => {
   if (prevProps.muted != nextProps.muted ||
      prevProps.paused != nextProps.paused ||
      prevProps.source != nextProps.source
   ) {
      return false
   }

   return true
}

MediaPlayer.defaultProps = {
   height: Metrics.heightRatio(255),
   resizeMode: 'contain'
}

export default memo(MediaPlayer, propsAreEqual)