import React, {useState, useEffect} from 'react';
import {Modal, Platform, View} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {Wrap, Row} from 'src/components/Common';
import Typography from 'src/components/Typography';
import VectorIcon from 'src/components/VectorIcon';
import TouchableItem from 'src/components/TouchableItem';
import {Button} from 'src/components/Button';
import {styles} from './styles';
import FilterList from './FilterList';
import Theme from 'src/theme';
import {genders} from 'src/utils/StaticData/StaticData';

const IOS = Platform.OS === 'ios';
const RADIO_OFF_ICON = IOS ? 'ios-radio-button-off' : 'md-radio-button-off';
const RADIO_ON_ICON = IOS ? 'ios-radio-button-on' : 'md-radio-button-on';

export default function FilterModal(props: any) {
  const {
    dialogVisible,
    setDialogVisible,
    onSelectedItem,
    title,
    selectedFilters,
    height = '90%',
  } = props;

  const [activeTab, setActiveTab] = useState('Gender');
  const [filterData, setFilterData] = useState({});

  const [selectedFiltersState, setSelectedFiltersState] =
    useState(selectedFilters);

  useEffect(() => {}, []);

  const applyFilter = () => {
    onSelectedItem(selectedFiltersState);
  };

  const resetFilter = () => {
    onSelectedItem({
      genders: [],
      religions: [],
      origins: [],
      rashis: [],
      numerologies: [],
      nakshatras: [],
      alphabets: [],
      gods: [],
    });
  };

  const __setSelectedFiltersState = (
    __selectedFilters: any,
    __filterName: string,
  ) => {
    // console.log(
    //   '__setSelectedFiltersState __selectedFilters',
    //   __selectedFilters,
    // );
    const selectedFiltersStateTmp = {...selectedFiltersState};
    selectedFiltersStateTmp[__filterName] = __selectedFilters;
    setSelectedFiltersState(selectedFiltersStateTmp);

    // console.log(
    //   '__setSelectedFiltersState selectedFiltersStateTmp',
    //   selectedFiltersStateTmp,
    // );
  };

  return (
    <Modal
      visible={dialogVisible}
      transparent={true}
      animationType={'slide'}
      onRequestClose={() => {
        setDialogVisible(false);
      }}>
      <Wrap autoMargin={false} style={styles.mainContainer}>
        {/* Custom Header */}
        <Wrap
          autoMargin={false}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: Theme.colors.primaryColor,
          }}>
          <Wrap
            autoMargin={false}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}>
            <TouchableItem
              borderless={true}
              style={{padding: 5, marginRight: 15}}
              onPress={() => setDialogVisible(false)}>
              <VectorIcon
                iconPack="Ionicons"
                name={'close-sharp'}
                size={25}
                color={Theme.colors.white}
              />
            </TouchableItem>
            <Typography text={title} size={17} color={Theme.colors.white} />
          </Wrap>

          <Wrap
            autoMargin={false}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableItem style={{padding: 15}} onPress={() => resetFilter()}>
              <Typography text={'Reset'} size={17} color={Theme.colors.white} />
            </TouchableItem>
          </Wrap>
        </Wrap>

        <Wrap autoMargin={false} style={styles.mainContainer2}>
          {/* Left Sidebar */}
          <Wrap autoMargin={false} style={styles.leftSideContainer}>
            <Wrap autoMargin={false} style={styles.leftSide}>
              <TouchableItem
                // @ts-ignore
                style={[
                  styles.leftSideItem,
                  //@ts-ignore
                  activeTab === 'Gender' && {backgroundColor: Theme.colors.white},
                ]}
                onPress={() => setActiveTab('Gender')}>
                <Wrap autoMargin={false}>
                  <Typography text={'Gender'} size={15} />
                </Wrap>
              </TouchableItem>
            </Wrap>
          </Wrap>

          {/* Right Sidebar */}
          <Wrap autoMargin={false} style={styles.rightSideContainer}>
            <>
              {/* Start Gender */}
              {activeTab == 'Gender' && (
                <Wrap autoMargin={false} style={styles.rightSide}>
                  <Wrap autoMargin={false} style={styles.filterTitle}>
                    <Typography text={'Gender'} size={17} />
                  </Wrap>

                  <FilterList
                    data={genders}
                    filterName="genders"
                    selectedFilters={selectedFiltersState?.genders}
                    onPress={(data: any) =>
                      __setSelectedFiltersState(data, 'genders')
                    }
                  />
                </Wrap>
              )}
              {/* End Gender */}
            </>
          </Wrap>
        </Wrap>
      </Wrap>

      <Wrap autoMargin={false} style={styles.bottomButtonsContainer}>
        <Button title={'Apply Now'} onPress={applyFilter} />
      </Wrap>
    </Modal>
  );
}
