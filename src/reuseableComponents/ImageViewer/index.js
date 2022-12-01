import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, Image, View } from 'react-native';
import PropTypes from 'prop-types';
//import Loader from '../../Loader';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Images, Metrics, AppStyles, Colors } from '../../theme';
import { ButtonView, ImageHandler } from '..';

const renderLoader = () => <View />;
const renderDottedIndicators = (position, totalImages) => {
  // if there is only one image then don't render dot
  if (totalImages <= 1) return null;

  return (
    <View style={styles.containerIndicators}>
      <View style={styles.containerHorizontal}>
        {Array(totalImages + 1)
          .fill()
          .map((_, i) => {
            if (i == 0) return null;
            return (
              <View
                key={`${i}_dot`}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      i == position ? 'white' : Colors.bg.lightGray,
                  },
                ]}
              />
            );
          })}
      </View>
    </View>
  );
};

const dummyImages = [];

const ImageViewerModal = forwardRef((props, ref) => {
  const [isVisible, setVisible] = useState(false);
  const [images, setImages] = useState(dummyImages);
  const [imgIndex, setImgIndex] = useState(0);
  ImageViewerModal.propTypes = {
    cardStyle: PropTypes.object,
  };
  ImageViewerModal.defaultProps = {
    cardStyle: {},
  };

  hide = () => {
    setVisible(false);
  };
  useImperativeHandle(ref, () => ({
    show() {
      setVisible(true);
    },
    hideModal() {
      setVisible(false);
    },
    setImagesArray(imagesArray) {
      setImages(imagesArray);
    },
    setImageIndex(index) {
      setImgIndex(index);
    },
  }));

  return (
    <Modal transparent={true} visible={isVisible} animationIn="fadeIn">
      <ImageViewer
        imageUrls={images}
        enableSwipeDown
        onCancel={() => {
          this.hide();
        }}
        index={imgIndex}
        footerContainerStyle={styles.containerFooter}
        enableImageZoom={false}
        renderHeader={() => (
          <ButtonView style={styles.containerHeader} onPress={hide}>
            <Image source={Images.icCross} style={styles.icCross} />
          </ButtonView>
        )}
        enablePreload
        renderFooter={props.renderFooter}
        renderIndicator={renderDottedIndicators}
        loadingRender={renderLoader}
        renderImage={({ style, source }) => (
          <ImageHandler showLoader style={style} source={source} />
        )}
      />
    </Modal>
  );
});

export default ImageViewerModal;

const styles = {
  containerIndicators: {
    position: 'absolute',
    bottom: 20,
    width: Metrics.screenWidth,
    ...AppStyles.centerAligned,
  },
  containerHorizontal: {
    flexDirection: 'row',
    height: Metrics.widthRatio(20),
    borderRadius: Metrics.widthRatio(10),
    backgroundColor: Colors.translucent,
    ...AppStyles.centerAligned,
  },
  dot: { height: 10, width: 10, margin: 8, borderRadius: 5 },
  containerFooter: {
    flex: 1,
    alignSelf: 'center',
  },
  containerHeader: {
    position: 'absolute',
    left: 20,
    top: 50,
    zIndex: 1,
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  icCross: { width: 20, height: 20 },
};
