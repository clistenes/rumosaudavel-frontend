import LogoBox from '@/components/LogoBox'
import React, { Suspense } from 'react'
import AppMenu from './components/AppMenu'
import { getMenuItems } from '@/helpers/menu'
import FallbackLoading from '@/components/FallbackLoading'
import Image from 'next/image'
import partyImg from '@/assets/images/extra/party.gif'
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient'

const LeftSideBar = () => {
  const menuItems = getMenuItems()
  return (
    <div className="startbar d-print-none">
      <div className="brand flex-column justify-content-center text-center">
        <LogoBox />
      </div>
      <div className="startbar-menu">
        <SimplebarReactClient className="startbar-collapse" id="startbarCollapse" data-simplebar>
          <div className="d-flex align-items-start flex-column w-100">
            <Suspense fallback={<FallbackLoading />}>
              <AppMenu menuItems={menuItems} />
            </Suspense>
            
          </div>
        </SimplebarReactClient>
      </div>
    </div>
  )
}

export default LeftSideBar