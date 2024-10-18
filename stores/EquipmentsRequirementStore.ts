import {Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree';
import {InventoryForm}
  from 'components/calculationInput/equipments/inventory/InventoryUpdateDialog';

let equipmentsRequirementStore: IEquipmentsRequirementStore | undefined;

const byPiece = types
    .model('RequirementByPiece', {
      pieceId: types.string,
      count: types.number,
    })
    .volatile(() => ({
      uuid: crypto.randomUUID(),
    }));

const byEquipment = types
    .model('RequirementByEquipment', {
      currentEquipmentId: types.string,
      targetEquipmentId: types.string,
      count: types.number,
      nickname: types.optional(types.string, ''),
    })
    .volatile(() => ({
      uuid: crypto.randomUUID(),
    }));

const pieceInventory = types
    .model('PieceInventory', {
      pieceId: types.identifier,
      inStockCount: types.number,
    });

export enum RequirementMode {
  ByPiece = 'ByPiece',
  ByEquipment = 'ByEquipment',
}

export enum ResultMode {
  ListStages = 'ListStages',
  LinearProgram = 'LinearProgram'
}

export const EquipmentsRequirementStore = types
    .model('EquipmentsRequirementStore', {
      requirementByPieces: types.array(byPiece),
      requirementByEquipments: types.array(byEquipment),
      piecesInventory: types.map(pieceInventory),
      requirementMode: types.optional(
          types.enumeration<RequirementMode>('RequirementMode', Object.values(RequirementMode)),
          RequirementMode.ByEquipment
      ),
      resultMode: types.optional(
          types.enumeration<ResultMode>('ResultMode', Object.values(ResultMode)),
          ResultMode.LinearProgram
      ),
    })
    .actions((self) => {
      const addPiecesRequirement = (requirement: IRequirementByPieceIn) => {
        self.requirementByPieces.push(byPiece.create(requirement));
      };

      const updatePiecesRequirement = (pieceInfoToEdit : PieceInfoToEdit) => {
        const {uuid} = pieceInfoToEdit;
        const index = self.requirementByPieces.findIndex((it) => it.uuid === uuid);
        if (index < 0) return;
        self.requirementByPieces[index] = byPiece.create(pieceInfoToEdit);
      };

      const deletePiecesRequirement = (pieceInfoToEdit : PieceInfoToEdit) => {
        const {uuid} = pieceInfoToEdit;
        const index = self.requirementByPieces.findIndex((it) => it.uuid === uuid);
        if (index < 0) return;
        self.requirementByPieces.splice(index, 1);
      };

      const sortEquipmentStoreByNickName = () => {
        self.requirementByEquipments.sort(
            (a, b) => {
              const aHasNickName = a.nickname.length !== 0;
              const bHasNickName = b.nickname.length !== 0;
              if (aHasNickName !== bHasNickName) return aHasNickName ? -1 : 1;
              return a.nickname > b.nickname ? 1:-1;
            }
        );
      };

      const addEquipmentsRequirement = (requirement : IRequirementByEquipmentIn) => {
        self.requirementByEquipments.push(byEquipment.create(requirement));
        if (requirement.nickname) {
          sortEquipmentStoreByNickName();
        }
      };

      const updateEquipmentsRequirement = (equipInfoToEdit : EquipmentInfoToEdit) => {
        const {uuid} = equipInfoToEdit;
        const index = self.requirementByEquipments.findIndex((it) => it.uuid === uuid);
        if (index < 0) return;
        const {nickname} = self.requirementByEquipments[index];

        self.requirementByEquipments[index] = byEquipment.create(equipInfoToEdit);
        if (equipInfoToEdit.nickname !== nickname) {
          sortEquipmentStoreByNickName();
        }
      };

      const deleteEquipmentsRequirement = (equipInfoToEdit : EquipmentInfoToEdit) => {
        const {uuid} = equipInfoToEdit;
        const index = self.requirementByEquipments.findIndex((it) => it.uuid === uuid);
        if (index < 0) return;

        self.requirementByEquipments.splice(index, 1);
      };

      const getAllRequiredPieceIds = () => {
        return self.requirementByPieces.reduce<Set<string>>(
            (set, curr) => {
              return set.add(curr.pieceId);
            }, new Set()
        );
      };

      const updateRequirementMode = (requirementMode: RequirementMode) => {
        if (!requirementMode) return;
        self.requirementMode = requirementMode;
      };

      const updateResultMode = (resultMode: ResultMode) => {
        if (!resultMode) {
          console.error(`Unable to set because resultMode is ${resultMode} this is unexpected`);
          return;
        }
        self.resultMode = resultMode;
      };

      const updateInventory = (inventoryForm: InventoryForm) => {
        for (const [pieceId, inStockCountStr] of Object.entries(inventoryForm)) {
          const inStockCount = parseInt(inStockCountStr) ?? 0;
          if (inStockCount !== 0) {
            self.piecesInventory.put({pieceId, inStockCount});
          } else {
            self.piecesInventory.delete(pieceId);
          }
        }
      };

      const addPiecesToInventory = (pieces: InventoryForm) => {
        updateInventory(Object.fromEntries(Object.entries(pieces).map(([id, value]) => {
          const count = parseInt(value) || 0;
          const stock = self.piecesInventory.get(id)?.inStockCount || 0;
          return [id, `${count + stock}`];
        })));
      };

      return {addPiecesRequirement, updatePiecesRequirement, deletePiecesRequirement,
        addEquipmentsRequirement, updateEquipmentsRequirement, deleteEquipmentsRequirement,
        getAllRequiredPieceIds, updateRequirementMode, updateInventory,
        updateResultMode, addPiecesToInventory,
      };
    });

export type IEquipmentsRequirementStore = Instance<typeof EquipmentsRequirementStore>
export type IRequirementByPieceIn = SnapshotIn<typeof byPiece>
export type IRequirementByPiece = Instance<typeof byPiece>
export type IPieceInventory = Instance<typeof pieceInventory>
export type IRequirementByEquipmentIn = SnapshotIn<typeof byEquipment>
export type IRequirementByEquipment = Instance<typeof byEquipment>
export type PieceInfoToEdit = IRequirementByPiece;
export type EquipmentInfoToEdit = IRequirementByEquipment;

export type IStoreSnapshotIn = SnapshotIn<typeof EquipmentsRequirementStore>
export type IStoreSnapshotOut = SnapshotOut<typeof EquipmentsRequirementStore>
