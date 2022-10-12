import React, { SyntheticEvent, useState } from 'react'

import * as classes from './goods-filter.module.scss'

interface Product {
	category: string
	price: string
	stocked: boolean
	name: string
}

interface ProductFilter {
	text: string
	stockOnly: boolean
}

function FilterableProductTable(props: {data: Product[]}) {
	const [ filter, setFilter ] = useState({text: '', stockOnly: false})

	let handleFilterChange = (data: ProductFilter) => {
		setFilter(data)
	}

	let filterData = (data: Product[]) => {
		return data.filter((item) => {
			if(filter.stockOnly && !item.stocked) {
				return false
			}
			if(-1 == item.name.indexOf(filter.text)) {
				return false
			}
			return true
		})
	}

	return (
		<div className={classes.FilterableProductTable}>
			<SearchBar filter={filter} onChange={handleFilterChange} />
			<ProductTable data={filterData(props.data)} filter={filter} />
		</div>
	)
}

function SearchBar(props: {filter: ProductFilter, onChange: (data: ProductFilter) => any}) {
	const { filter, onChange, ...other } = props

	let handleTextChange = (e: SyntheticEvent) => {
		let target = e.target as HTMLInputElement
		onChange(Object.assign({}, filter, {
			[target.name]: target.value
		}))
	}

	let handleCheckChange = (e: SyntheticEvent) => {
		let target = e.target as HTMLInputElement
		onChange(Object.assign({}, filter, {
			[target.name]: target.checked
		}))
	}

	return (
		<div className={classes.SearchBar}>
			<div className={classes.SearchBar__textField}>
				<input name="text" type="text" value={filter.text} onChange={handleTextChange} placeholder="Filter" />
			</div>
			<div className={classes.SearchBar__checkBox}>
				<label>
					<input name="stockOnly" type="checkbox" onChange={handleCheckChange} checked={filter.stockOnly} />
					Stocked items only
				</label>
			</div>
		</div>
	)
}

function ProductTable(props: {data: Product[], filter: ProductFilter}) {
	const { data, filter, ...other } = props

	let categorizedData: {[index: string]: Product[]} = {}
	for(let item of data) {
		if(undefined === categorizedData[item.category]) {
			categorizedData[item.category] = []
		}
		categorizedData[item.category].push(item)
	}

	let tableElements: JSX.Element[] = []
	for(let category in categorizedData) {
		tableElements.push(
			<ProductTableHeader key={`__category_${category}`} category={category} />
		)
		for(let item of categorizedData[category]) {
			tableElements.push(
				<ProductTableItem key={`__item_${item.name}`} item={item} />
			)
		}
	}

	return (
		<div className={classes.ProductTable}>
			<table><tbody>
				<tr>
					<th>Name</th>
					<th>Price</th>
				</tr>
				{tableElements}
			</tbody></table>
		</div>
	)
}

function ProductTableHeader(props: {category: string}) {
	const { category, ...other } = props

	return (
		<tr className={classes.ProductTableHeader} {...other}>
			<td colSpan={2}>{category}</td>
		</tr>
	)
}

function ProductTableItem(props: {item: Product}) {
	const { item, ...other } = props
	
	return (
		<tr {...other} className={item.stocked ? classes.itemStocked : classes.itemSoldout}>
			<td>
				{item.name}
			</td>
			<td>
				{item.price}
			</td>
		</tr>
	)
}

function ProductTableApp(props: {}) {
	let data = [
		{category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
		{category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
		{category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
		{category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
		{category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
		{category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
	];
	return <FilterableProductTable data={data} />
}

export { FilterableProductTable, ProductTableApp }
