import { AppContext } from "~/contexts/AppContext"
import { useContext } from "react"

function useAppContext() {
  const { isMobile, setIsMobile, activePanel, setActivePanel, activeSubMenu, setActiveSubMenu } = useContext(AppContext)
  return {
    isMobile,
    setIsMobile,
    activePanel,
    setActivePanel,

    activeSubMenu,
    setActiveSubMenu,
  }
}

export default useAppContext
