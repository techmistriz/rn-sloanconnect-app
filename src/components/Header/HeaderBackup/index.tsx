import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, ViewStyle} from 'react-native';
import VectorIcon from 'src/components/VectorIcon';
import Theme from 'src/theme';
import PropTypes from 'prop-types';
import {styles} from './styles';
import {Icons, Images} from 'src/assets';
import {Wrap, Row} from 'src/components/Common';
import Typography from 'src/components/Typography';
import TouchableItem from 'src/components/TouchableItem';
import {getImgSource, showConfirmAlert} from 'src/utils/Helpers/HelperFunction';
import {loginResetDataAction, settingsResetDataAction} from 'src/redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import NavigationService from 'src/services/NavigationService/NavigationService';
import AlertBox from 'src/components/AlertBox';

// Header Props
type HeaderProps = {
  haslogOutButton?: boolean;
  hasBackButton?: boolean;
  hasLeftButton?: boolean;
  hasRightButton?: boolean;
  navigation?: any;
  title?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  onLogoutPress?: () => void;
  headerContainerStyle?: ViewStyle;
  headerLeftStyle?: ViewStyle;
  headerRightStyle?: ViewStyle;
};

// Header
const Header = ({
  haslogOutButton = false,
  hasBackButton = true,
  hasLeftButton = false,
  hasRightButton = false,
  navigation,
  title = '',
  onLeftPress,
  onRightPress,
  onLogoutPress,
  headerContainerStyle,
  headerLeftStyle,
  headerRightStyle,
}: HeaderProps) => {
  const dispatch = useDispatch();
  const [logoutModal, setLogoutModal] = useState<boolean>(false);

  const onLogout = async () => {
    dispatch(loginResetDataAction());
    // dispatch(settingsResetDataAction());
    NavigationService.resetAllAction('Login');
  };

  return (
    <Row
      autoMargin={false}
      style={[styles.__headerContainerStyle, {...headerContainerStyle}]}>
      <Wrap
        autoMargin={false}
        style={[styles.__headerLeftStyle, {...headerLeftStyle}]}>
        {haslogOutButton ? (
          <TouchableItem
            borderless={true}
            onPress={() => {
              setLogoutModal(true);
            }}>
            <VectorIcon
              iconPack="MaterialIcons"
              name={'logout'}
              size={22}
              color={Theme.colors.white}
              style={{
                transform: [{rotateY: '180deg'}],
              }}
            />
          </TouchableItem>
        ) : hasBackButton ? (
          <TouchableItem
            borderless={true}
            onPress={() => {
              NavigationService.goBack &&  NavigationService.goBack();
            }}
            style={{}}>
            <VectorIcon
              iconPack="MaterialIcons"
              name={'arrow-back'}
              size={22}
              color={Theme.colors.white}
              style={{}}
            />
          </TouchableItem>
        ) : (
          <TouchableItem borderless={true} onPress={() => {}}>
            <VectorIcon
              iconPack="MaterialIcons"
              name={'logout'}
              size={22}
              color={Theme.colors.white}
              onPress={() => {}}
              style={{
                display: 'none',
              }}
            />
          </TouchableItem>
        )}
      </Wrap>
      <Wrap autoMargin={false} style={styles.__headerCenterStyle}>
        {title ? (
          <Typography
            size={16}
            text={title}
            style={{textAlign: 'center', marginTop: 10}}
            color={Theme.colors.white}
            ff={Theme.fonts.ThemeFontMedium}
          />
        ) : (
          <Image
            // @ts-ignore
            source={getImgSource(Images?.appLogoWhite)}
            style={{
              width: '90%',
            }}
            resizeMode="contain"
          />
        )}
      </Wrap>
      <Wrap
        autoMargin={false}
        style={[styles.__headerRightStyle, {...headerRightStyle}]}>
        {hasRightButton ? (
          <TouchableItem
            borderless={true}
            onPress={() => {
              onRightPress && onRightPress();
            }}>
            <>
              {/* <VectorIcon
                iconPack="FontAwesome"
                name={'spinner'}
                size={22}
                color={Theme.colors.white}
                style={
                  {
                    // display: 'none',
                  }
                }
              /> */}
              <Image
                // @ts-ignore
                source={getImgSource(Icons?.loader)}
                style={{width: 22, height: 22}}
                resizeMode="contain"
              />
            </>
          </TouchableItem>
        ) : null}
      </Wrap>

      <AlertBox
        visible={logoutModal}
        title="Logout"
        message={`Are you sure you want to log out?`}
        okayText={'CONFIRM'}
        onCancelPress={() => {
          setLogoutModal(false);
        }}
        onOkayPress={() => {
          setLogoutModal(false);
          onLogout();
        }}
      />
    </Row>
  );
};

export default Header;
