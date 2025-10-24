import 'jsvectormap'
import 'jsvectormap/dist/maps/world.js'
import 'jsvectormap/dist/jsvectormap.min.css'
import BaseVectorMap from '@/components/VectorMap/BaseVectorMap'

type WorldVectorMapProps = {
  width?: string
  height?: string
  options?: any
}

const WorldMap = ({ width, height, options }: WorldVectorMapProps) => <BaseVectorMap width={width} height={height} options={options} type="world" />

export default WorldMap
