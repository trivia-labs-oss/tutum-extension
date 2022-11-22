import cx from 'classnames'
import { ethers } from 'ethers'
import _ from 'lodash'
import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import shieldIcon from '../assets/icons/shield.svg'
import { Event, EventType, SimulationResult } from '../types/simulation'
import Section from './Section'

const EventItem: FC<{ event: Event }> = ({ event }) => {
  return (
    <div className="flex flex-row items-center gap-[10px]">
      <img src={event.image} className="w-10 h-10 rounded-[8px]" />
      <div className="flex flex-col justify-between h-full min-w-0">
        <div className="flex flex-row items-center">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold">
            {event.name}
          </span>
          {event.verified && <img src={shieldIcon} className="w-4 h-4 ml-1" />}
        </div>
        {!!event.desc && (
          <span className="font-medium text-[#808080] overflow-hidden text-ellipsis">
            {event.desc}
          </span>
        )}
      </div>
      <span
        className={cx(
          event.type === EventType.TransferIn ? 'text-green' : 'text-red',
          'ml-auto font-semibold',
        )}
      >
        {event.type === EventType.TransferIn ? '+' : '-'}
        {ethers.utils.formatUnits(event.amount || 1, event.decimals || 0)}
      </span>
    </div>
  )
}

const EventList: FC<{ events: Event[] }> = (props) => {
  // put transfer out events first
  const events = useMemo(() => {
    return _.sortBy(props.events, (e) => (e.type === EventType.TransferOut ? 0 : 1))
  }, [props.events])
  return (
    <div className="flex flex-col gap-5">
      {events.map((event) => {
        if (event.type === EventType.TransferIn || event.type === EventType.TransferOut) {
          return <EventItem event={event} />
        }
      })}
    </div>
  )
}

const SimulationSection: FC<{ result: SimulationResult }> = ({ result }) => {
  const { t } = useTranslation()
  return (
    <Section title={t('simulationTitle')} className="mt-[30px]">
      {(() => {
        if (!result.success) {
          return <span className="text-sm">{t('textSimulationFailed')}</span>
        }
        if (!result.simulation.events.length) {
          return <span className="text-sm">{t('textSimulationEmpty')}</span>
        }
        return <EventList events={result.simulation.events} />
      })()}
    </Section>
  )
}

export default SimulationSection
