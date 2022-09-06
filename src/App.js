import React, { useState, useLayoutEffect } from 'react'
import { Table } from 'antd'
import 'antd/dist/antd.css'
import AdsApi from './adsApi'

const titleMap = {
  'image_url': 'Image Url',
  'ad_name': 'Ad name',
  'total_revs': 'Revenues',
  'total_spend': 'Spend',
  'total_profit': 'Profit',
  'total_sessions': 'Sessions',
  'total_paid_clicks': 'Paid Clicks',
  'total_page_views': 'Page Views',
  'cpc': 'CPC',
  'roas': 'ROAS',
  'discrepancy': 'Discrepancy',
  'prmp': 'PRPM',
}

const adKeys = Object.keys(titleMap)

const getColumns = () => (
  adKeys
    .filter(field => adKeys.includes(field))
    .map(field => ({
      title: titleMap[field],
      dataIndex: field,
      key: field,
      render: (_text, record) => {
        adKeys.forEach(key => {
          switch (key) {
            case 'total_revs':
            case 'total_spend':
            case 'total_profit':
            case 'cpc':
              record[key] = `${parseFloat(record[key]).toFixed(2)}$`
              break
            case 'roas':
              record[key] = `${parseFloat(record[key]).toFixed(2)}%`
              break
            case 'discrepancy':
              record[key] = record['total_paid_clicks'] 
                ? `${parseFloat(record['total_sessions'] / record['total_paid_clicks'] * 100).toFixed(2)}%`
                : `${parseFloat(0).toFixed(2)}%`
              break
            case 'prmp':
              record[key] = `${parseFloat(1000 * parseFloat(record['total_revs']) / record['total_page_views']).toFixed(2)}$`
              break
            case 'image_url':
              record[key] = record[key] || ''
              break
            default:
              break
          }    
        })

        return (
          <>
            {field === 'image_url'
              ? <>{record[field] ? <img src={record[field]}></img> : <p></p>}</>
              : <p>{record[field]}</p>}
          </>
        )
      }
    }))
)

const App = () => {
  const [ads, setAds] = useState([])

  useLayoutEffect(() => {
    const fetchData = async () => {
      const { data } = await AdsApi.getAds()

      setAds(data)
    }

    fetchData()
  }, [])

  return (
    <div className="App">
      <Table dataSource={ads} columns={getColumns()} />
    </div>
  );
};

export default App;
