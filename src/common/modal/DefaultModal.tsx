import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Modal, {ModalProps} from 'react-native-modal/dist/modal';

const DefaultModal = ({...props}: ModalProps) => {
  return <Modal {...props}>{props.children}</Modal>;
};

DefaultModal.CustomBackdropModal = ({...props}: ModalProps) => {
  return (
    <Modal {...props}>
      <SafeAreaView style={styles.customBackdrop}>
        {props.children}
      </SafeAreaView>
    </Modal>
  );
};

DefaultModal.BottomHalfModal = ({...props}: ModalProps) => {
  return (
    <Modal
      swipeDirection={['up', 'left', 'right', 'down']}
      style={styles.view}
      {...props}>
      {props.children}
    </Modal>
  );
};

export default DefaultModal;

const styles = StyleSheet.create({
  customBackdrop: {
    flex: 1,
    backgroundColor: '#87BBE0',
    alignItems: 'center',
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
