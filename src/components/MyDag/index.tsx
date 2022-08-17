import React from 'react'
/** app 核心组件 */
import { XFlow, XFlowCanvas, KeyBindings } from '@antv/xflow'
import type { IApplication, IAppLoad } from '@antv/xflow'
/** 交互组件 */
import {
  /** 触发Command的交互组件 */
  CanvasScaleToolbar,
  JsonSchemaForm,
  NodeCollapsePanel,
  CanvasContextMenu,
  CanvasToolbar,
  /** Graph的扩展交互组件 */
  CanvasSnapline,
  CanvasNodePortTooltip,
  DagGraphExtension,
} from '@antv/xflow'

/** app 组件配置  */
/** 配置画布 */
import { useGraphHookConfig } from './config-graph'
/** 配置Command */
import { useCmdConfig, initGraphCmds } from './config-cmd'
/** 配置Model */
import { useModelServiceConfig } from './command/config-model-service'
/** 配置Menu */
import { useMenuConfig } from './command/config-menu'
/** 配置Toolbar */
import { useToolbarConfig } from './command/config-toolbar'
/** 配置快捷键 */
import { useKeybindingConfig } from './command/config-keybinding'
/** 配置Dnd组件面板 */
import * as dndPanelConfig from './command/config-dnd-panel'
/** 配置JsonConfigForm */
// import { NsJsonForm, formValueUpdateService, controlMapService } from './command/config-form'

import '@antv/xflow/dist/index.css'
import './index.less'

export interface IProps {
  meta: { flowId: string }
}

export const MyDag: React.FC<IProps> = props => {
  const { meta } = props
  const graphHooksConfig = useGraphHookConfig(props)
  const toolbarConfig = useToolbarConfig()
  const menuConfig = useMenuConfig()
  const cmdConfig = useCmdConfig()
  const modelServiceConfig = useModelServiceConfig()
  const keybindingConfig = useKeybindingConfig()

  const cache = React.useMemo<{ app: IApplication } | null>(
    () => ({
      // @ts-ignore
      app: null,
    }),
    [],
  )
  /**
   * @param app 当前XFlow工作空间
   * @param extensionRegistry 当前XFlow配置项
   */

  const onLoad: IAppLoad = async app => {
    // @ts-ignore
    cache.app = app
    // @ts-ignore
    initGraphCmds(cache.app)
  }

  /** 父组件meta属性更新时,执行initGraphCmds */
  React.useEffect(() => {
    // @ts-ignore
    if (cache.app) {
      // @ts-ignore
      initGraphCmds(cache.app)
    }
    // @ts-ignore
  }, [cache.app, meta])

  return (
    // @ts-ignore
    <XFlow
      className="dag-user-custom-clz"
      hookConfig={graphHooksConfig}
      modelServiceConfig={modelServiceConfig}
      commandConfig={cmdConfig}
      onLoad={onLoad}
      meta={meta}
    >
      <DagGraphExtension />
      <NodeCollapsePanel
        className="xflow-node-panel"
        searchService={dndPanelConfig.searchService}
        nodeDataService={dndPanelConfig.nodeDataService}
        onNodeDrop={dndPanelConfig.onNodeDrop}
        position={{ width: 230, top: 0, bottom: 0, left: 0 }}
        footerPosition={{ height: 0 }}
        bodyPosition={{ top: 40, bottom: 0, left: 0 }}
      />
      <CanvasToolbar
        className="xflow-workspace-toolbar-top"
        layout="horizontal"
        config={toolbarConfig}
        position={{ top: 0, left: 230, right: 0, bottom: 0 }}
      />
      <
        // @ts-ignore
        XFlowCanvas
        position={{ top: 40, left: 230, right: 0, bottom: 0 }}>
        <CanvasScaleToolbar position={{ top: 12, right: 12 }} />
        <CanvasContextMenu config={menuConfig} />
        <CanvasSnapline color="#faad14" />
        <CanvasNodePortTooltip />
      </XFlowCanvas>
    </XFlow>
  )
}
// <JsonSchemaForm
// controlMapService={controlMapService}
//   getCustomRenderComponent={NsJsonForm.getCustomRenderComponent}
//   formSchemaService={NsJsonForm.formSchemaService}
//   formValueUpdateService={formValueUpdateService}
//   bodyPosition={{ top: 0, bottom: 0, right: 0 }}
//   position={{ width: 290, top: 0, bottom: 0, right: 0 }}
//   footerPosition={{ height: 0 }}
// />
// <KeyBindings config={keybindingConfig} />
export default MyDag

MyDag.defaultProps = {
  meta: { flowId: 'test-meta-flow-id' },
}