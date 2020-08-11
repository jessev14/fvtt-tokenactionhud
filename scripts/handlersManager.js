import { ActionHandler5e } from './actions/dnd5e/dnd5e-actions.js';
import { MagicItemActionListExtender } from './actions/dnd5e/magicItemsExtender.js';
import { ItemMacroActionListExtender } from './actions/dnd5e/itemMacroExtender.js';
import { ActionHandlerWfrp } from './actions/wfrp4e/wfrp4e-actions.js';
import { ActionHandlerPf2e } from './actions/pf2e/pf2e-actions.js';
import { ActionHandlerDw } from './actions/dungeonworld/dw-actions.js';
import { ActionHandlerSfrpg } from './actions/sfrpg/sfrpg-actions.js';
import { CompendiumMacroPreHandler } from './rollHandlers/compendiumMacroPreHandler.js';

import * as roll5e from './rollHandlers/dnd5e/dnd5e-factory.js';
import * as rollWfrp from './rollHandlers/wfrp4e/wfrp4e-factory.js';
import * as rollPf2e from './rollHandlers/pf2e/pf2e-factory.js';
import * as rollDw from './rollHandlers/dungeonworld/dw-factory.js';
import * as rollSf from './rollHandlers/sfrpg/sfrpg-factory.js';


export class HandlersManager {
    // Currently only planning for one kind of action handler for each system
    static getActionHandler(system, filterManager, categoryManager) {
        switch (system) {
            case 'dnd5e':
                return HandlersManager.getActionHandler5e(filterManager, categoryManager);
            case 'pf2e':
                return new ActionHandlerPf2e(filterManager, categoryManager);
            case 'wfrp4e':
                return new ActionHandlerWfrp(filterManager, categoryManager);
            case 'dungeonworld':
                return new ActionHandlerDw(filterManager, categoryManager);
            case 'sfrpg':
                return new ActionHandlerSfrpg(filterManager, categoryManager);
        }
        throw new Error('System not supported by Token Action HUD');
    }

    static getActionHandler5e(filterManager, categoryManager) {
        let actionHandler = new ActionHandler5e(filterManager, categoryManager);
        if (HandlersManager.isModuleActive('magicitems'))
            actionHandler.addFurtherActionHandler(new MagicItemActionListExtender())
        if (HandlersManager.isModuleActive('itemacro'))
            actionHandler.addFurtherActionHandler(new ItemMacroActionListExtender())
        return actionHandler;
    }

    // Possibility for several types of rollers (e.g. BetterRolls, MinorQOL for DND5e),
    // so pass off to a RollHandler factory
    static getRollHandler(system, handlerId) {
        switch (system) {
            case 'dnd5e':
                return roll5e.getRollHandler(handlerId)
            case 'pf2e':
                return rollPf2e.getRollHandler(handlerId);
            case 'wfrp4e':
                return rollWfrp.getRollHandler(handlerId);
            case 'dungeonworld':
                return rollDw.getRollHandler(handlerId);
            case 'sfrpg':
                return rollSf.getRollHandler(handlerId);
        }

        rollHandler.addPreRollHandler(new CompendiumMacroPreHandler())
    }

    // Not yet implemented.
    static getRollHandlerChoices(system) {
        let choices;

        switch (system) {
            case 'dnd5e':
                choices = {'core': 'Core 5e'};
                this.addModule(choices, 'betterrolls5e');
                this.addModule(choices, 'minor-qol');
                break;
            case 'pf2e':
                choices = {'core': 'Core PF2E'};
                break;
            case 'wfrp4e':
                choices = {'core': 'Core Wfrp'};
                break;
            case 'dungeonworld':
                choices = {'core': 'Core DungeonWorld'};
            case 'sfrpg':
                choices = {'core': 'Core sfrpg'};
                break;
        }

        return choices;
    }

    static addModule(choices, id) {
        if (HandlersManager.isModuleActive(id)) {
            let title = game.modules.get(id).data.title;
            mergeObject(choices, { [id]: title })
        }
    }

    static isModuleActive(id) {
        let module = game.modules.get(id);
        return module && module.active;
    }
}