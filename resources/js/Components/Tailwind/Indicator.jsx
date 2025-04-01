import React from "react"

const IndicatorSimple = React.lazy(() => import('./Indicators/IndicatorSimple'))

const Indicator = ({ data, which, items }) => {
    const getIndicator = () => {
        switch (which) {

            case 'IndicatorSimple':
                return <IndicatorSimple data={data} items={items} />

            default:
                return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
        }
    }
    return getIndicator()
}

export default Indicator;