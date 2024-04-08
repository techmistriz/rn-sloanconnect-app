import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Alert,
  BackHandler,
  Linking,
} from 'react-native';

import Theme, {hexToRGBA} from 'src/theme';
import {constants} from 'src/common';
import AppContainer from 'src/components/AppContainer';
import {Wrap, Row} from 'src/components/Common';
import EmptyComponent from 'src/components/EmptyState';
import {Images} from 'src/assets';

const Index = () => {
  const [loading, setLoading] = useState(false);

  return (
    <AppContainer scroll={false} bottomGutter={0} loading={loading}>
      <Wrap autoMargin={false} style={{flex: 1}}>
        <EmptyComponent
          image={Images.noNotification}
          title="You're all cought up"
          message="This is where you'll see notifications."
        />
      </Wrap>
    </AppContainer>
  );
};

const styles = StyleSheet.create({});

export default Index;
