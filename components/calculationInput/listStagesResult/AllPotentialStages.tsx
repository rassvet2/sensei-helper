import styles from './AllPotentialStages.module.scss';
import React, {useMemo} from 'react';
import {useStore} from 'stores/WizStore';
import {Campaign} from 'model/Campaign';
import {PieceState} from 'components/calculationInput/equipments/inventory/PiecesInventory';
import {
  listAndSortPotentialCampaigns,
} from 'components/calculationInput/listStagesResult/listAndSortPotentialCampaigns';
import CampaignDropItemsList from 'components/calculationResult/CampaignDropItemsList';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {useTranslation} from 'next-i18next';
import Box from '@mui/material/Box';
import {getRewardsByRegion} from 'common/gameDataHandlerUtil';
import {ChipForm, useChipForm, useEquipmentCategoryGroup} from '../common/ActionChips';
import {useWatch} from 'react-hook-form';

const AllPotentialStages = ({
  campaigns, piecesState, equipmentsById,
}: {
  campaigns: Campaign[],
  equipmentsById: EquipmentsById,
  piecesState:Map<string, PieceState>,
}) => {
  const {t} = useTranslation('home');
  const store = useStore();
  const allPotentialCampaigns = useMemo(
      () => listAndSortPotentialCampaigns(store.equipmentsRequirementStore.requirementMode, campaigns, piecesState,
          store.equipmentsRequirementStore.getAllRequiredPieceIds(),
          store.gameInfoStore.gameServer,
      ), [campaigns, piecesState, store.equipmentsRequirementStore.requirementMode]
  );

  const [chipFormProps, {control}] = useChipForm({
    reward: useEquipmentCategoryGroup({type: 'radio', uncheckable: true}),
  }, {
    defaultValues: {
      reward: null,
    },
  });
  const [rewardCategory] = useWatch({control, name: ['reward']});
  const filterFunc = (campaign: Campaign) => {
    const isNully = (x: unknown) => x === null || x === undefined;
    const rewards = campaign && getRewardsByRegion(campaign, store.gameInfoStore.gameServer);
    return isNully(rewardCategory) ||
          rewards?.some(({id}) => equipmentsById.get(id)?.category === rewardCategory);
  };

  return <Box sx={{mt: 3}} className={styles.allStages}>
    <Box marginBottom='1rem'><ChipForm {...chipFormProps} /></Box>
    {
      allPotentialCampaigns.filter(filterFunc).map((campaign) => {
        const allDrops = campaign.potentialTargetRewards.map(({id, probability}) => ({id, dropProb: probability}));
        return <Box sx={{mt: 3}} key={campaign.id}>
          <CampaignDropItemsList
            campaignInfo={campaign} stageExplanationLabel={t('resultPiecesCountOnStage', {count: campaign?.targetRewardIds?.size})}
            allDrops={allDrops} equipmentsById={equipmentsById}
            shouldHighLightPiece={(id) => campaign.targetRewardIds.has(id)}
            hidePieceDropCount
            piecesState={piecesState} />
        </Box>;
      })
    }
  </Box>;
};

export default AllPotentialStages;
