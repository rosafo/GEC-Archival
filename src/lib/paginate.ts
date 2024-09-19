
export class PageInfo {
	private _currentPage: number;
	private _pageSize: number;
	private _totalItems: number;
	private _totalPages: number = 0;
	private _hasNextPage = false;
	private _hasPrevPage = false;
	private _nextPageUrl: string = '';
	private _prevPageUrl: string = '';

	constructor(pageSize = 100, currentPage = 1, totalItems = 0) {
		this._currentPage = currentPage;
		this._pageSize = pageSize;
		this._totalItems = totalItems;
		this.computePages();
	}

	private computePages() {
		this._totalPages = Math.ceil(this._totalItems / this._pageSize);
		this._currentPage = Math.max(1, Math.min(this._currentPage, this._totalPages));
		this._hasNextPage = this._totalPages > this._currentPage;
		this._hasPrevPage = this._currentPage > 1;
	}

	get currentPage() {
		return this._currentPage;
	}
	set currentPage(value: number) {
		this._currentPage = value;
	}
	get pageSize() {
		return this._pageSize;
	}
	get totalItems() {
		return this._totalItems;
	}
	get totalPages() {
		return this._totalPages;
	}
	get hasNextPage() {
		return this._hasNextPage;
	}
	get hasPrevPage() {
		return this._hasPrevPage;
	}
	get nextPageUrl() {
		return this._nextPageUrl;
	}
	get prevPageUrl() {
		return this._prevPageUrl;
	}

	setPageSize(newPageSize: number) {
		this._pageSize = newPageSize;
		this.computePages();
	}

	setHasNextPage(newValue: boolean) {
		this._hasNextPage = newValue;
	}
	setHasPrevPage(newValue: boolean) {
		this._hasPrevPage = newValue;
	}

	setNextPageUrl(newValue: string) {
		this._nextPageUrl = newValue;
	}

	setPrevPageUrl(newValue: string) {
		this._prevPageUrl = newValue;
	}

	gotoStart() {
		this._currentPage = 1;
	}

	gotoNext() {
		if (this._hasNextPage) {
			this._currentPage += 1;
			return true;
		}
		return false;
	}

	gotoPrev() {
		if (this._hasPrevPage) {
			this._currentPage -= 1;
			if (this._currentPage < 1) this._currentPage = 1;
			return true;
		}
		return false;
	}

	set totalItems(v: number) {
		this._totalItems = v;
		this.computePages();
	}
}
