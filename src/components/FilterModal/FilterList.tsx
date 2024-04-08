import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {Wrap} from 'src/components/Common';
import Typography from 'src/components/Typography';
import TouchableItem from 'src/components/TouchableItem';
import {styles} from './styles';
import Theme from 'src/theme';

const FilterList = (props: any) => {
  const [selectedFilters, setSelectedFilters] = useState(props.selectedFilters);

  useEffect(() => {
    // console.log('FilterList selectedFilters useEffect', selectedFilters);
  }, [selectedFilters]);

  const hasSelected = (item: any): boolean => {
    if (
      typeof selectedFilters != 'undefined' &&
      selectedFilters &&
      selectedFilters.length
    ) {
      if (props.filterName == 'genders' || props.filterName == 'alphabets') {
        return selectedFilters.includes(item?.name);
      } else {
        return selectedFilters.includes(parseInt(item?.id) || 0);
      }
    }
    return false;
  };

  const __onPress = (item: any) => {
    const selectedFiltersTmp: any = [...selectedFilters];
    // console.log('FilterList selectedFiltersTmp __onPress', selectedFiltersTmp);

    let _selector = 'id';
    let value: any = null;

    if (props.filterName == 'genders' || props.filterName == 'alphabets') {
      _selector = 'name';
      value = item[_selector];
    } else {
      value = parseInt(item[_selector]);
    }

    if (Array.isArray(selectedFiltersTmp) && selectedFiltersTmp.length) {
      const objIndex = selectedFiltersTmp.findIndex((obj: any) => obj == value);

      if (objIndex > -1) {
        selectedFiltersTmp.splice(objIndex, 1);
      } else {
        selectedFiltersTmp.push(value);
      }
    } else {
      selectedFiltersTmp.push(value);
    }

    setSelectedFilters(selectedFiltersTmp);
    props.onPress(selectedFiltersTmp);
  };

  return (
    <>
      {typeof props?.data !== 'undefined' &&
        Array.isArray(props?.data) &&
        props?.data.length > 0 && (
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={props?.data}
            renderItem={({item, index}) => (
              <Wrap key={index + ''} autoMargin={false}>
                <TouchableItem
                  style={styles.checkboxContainer}
                  onPress={() => __onPress(item)}>
                  <>
                    <CheckBox
                      value={hasSelected(item)}
                      onValueChange={val => __onPress(item)}
                      style={styles.checkbox}
                      tintColors={{true: Theme?.colors.primaryColor}}
                    />
                    <Typography
                      text={item?.name}
                      size={15}
                      color={Theme.colors.black}
                      style={{paddingLeft: 10}}
                    />
                  </>
                </TouchableItem>
              </Wrap>
            )}
            keyExtractor={item => item?.id?.toString()}
          />
        )}
    </>
  );
};

export default FilterList;
