import React from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';

// LoadingMore Props
type LoadingMoreProps = {
  loadingMore: boolean;
  loadingMoreText?: string;
};

// LoadMore
const LoadingMore = ({
  loadingMore = false,
  loadingMoreText = 'Loading more...',
}: LoadingMoreProps) => {
  return (
    <View>
      {loadingMore ? (
        <View
          style={{
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 15,
              textAlign: 'center',
            }}>
            {loadingMoreText}
          </Text>
          <ActivityIndicator color="#fff" style={{marginLeft: 8}} />
        </View>
      ) : null}
    </View>
  );
};

export default LoadingMore;
