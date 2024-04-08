import React, {forwardRef, useImperativeHandle} from 'react';
import {View} from 'react-native';
import {ModalBox} from 'src/components/ModalBox';
import {styles} from './styles';
import Theme from 'src/theme';

export const BottomSheet = forwardRef((props: any, ref) => {
  const {visible} = props;
  const sheetRef: any = React.useRef();

  useImperativeHandle(
    ref,
    () => ({
      closeModal: () => {
        sheetRef.current.close();
      },
    }),
    [],
  );

  return (
    <View>
      <ModalBox
        ref={sheetRef}
        backdropOpacity={0.8}
        coverScreen
        isOpen={visible}
        entry={'bottom'}
        backDropPressToClose={true}
        style={[styles.modalBox, props.height && {height: props.height}]}
        onClosed={() => props.onClosed()}
        position={'bottom'}
        swipeArea={100}
        animationDuration={200}
        backButtonClose={true}>
        <View style={[styles.line]} />
        {props.children}
      </ModalBox>
    </View>
  );
});
