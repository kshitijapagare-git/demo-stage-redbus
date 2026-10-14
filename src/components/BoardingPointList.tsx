import type { BoardingPoint, City } from '../types'

interface BoardingPointListProps {
  cities: City[]
  boardingPoints: BoardingPoint[]
}

function formatCityLabel(city: City | undefined): string {
  return city ? ` (${city.name}, ${city.state})` : ''
}

function BoardingPointList({ cities, boardingPoints }: BoardingPointListProps) {
  return (
    <ul className="bp-grid">
      {boardingPoints.map((boardingPoint) => {
        const city = cities.find((candidate) => candidate.id === boardingPoint.cityId)
        return (
          <li key={boardingPoint.id} className="bp-card">
            <strong>{boardingPoint.name}</strong>
            {' — '}
            {boardingPoint.address}, {boardingPoint.landmark}
            {formatCityLabel(city)}
          </li>
        )
      })}
    </ul>
  )
}

export default BoardingPointList
