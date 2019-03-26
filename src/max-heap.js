const Node = require('./node');

class MaxHeap {
	constructor() {
		this.root = null;
		this.parentNodes = [];
		this.count = 0;
	}

	push(data, priority) {
		let node = new Node(data, priority);
		this.insertNode(node);
		this.shiftNodeUp(node);
	}

	// returns data associated with root
	pop() {
		if (this.isEmpty()) {
			return;
		}

		let result = this.root.data;
		// define detached root
		let detached = this.detachRoot();
		// if graph has element or elements
		if (this.parentNodes.length > 0) {
			// define last added element like root of graph
			this.restoreRootFromLastInsertedNode(detached);
			//
			this.shiftNodeDown(this.root);
		}
		return result;
	}

	// remove root of graph and return removed root
	detachRoot() {
		// go to the graph top
		this._topRoot();

		let result = this.root;
		// if parentNodes has current node, remove
		if (this.parentNodes.indexOf(this.root) !== -1) {
			this.parentNodes.splice(0, 1);
		}
		// current node for result
		this.root = null;
		this.count--;
		return result;
	}

	restoreRootFromLastInsertedNode(detached) {
		// take last element and remove it from parent
		let last = this.parentNodes.pop();
		last.remove();

		// add to last element children
		last.appendChild(detached.left);
		last.appendChild(detached.right);
		// define last like first element
		this.root = last;
		// create parentNodes
		this.parentNodes = [];
		this._createInsertedArray(this.root);
		this._topRoot();
	}

	size() {
		return this.count;
	}

	isEmpty() {
		return this.root === null && this.parentNodes.length === 0;
	}

	clear() {
		this.root = null;
		this.parentNodes = [];
		this.count = 0;
	}

	insertNode(node) {
		// add new node in root and in parentNodes
		if (this.root === null) {
			this.root = node;
		} else {
			// add new node to root
			this.parentNodes[0].appendChild(node);
			// If element of parentNodes has two children, remove first element from parentNodes
			if (this.parentNodes[0].left !== null && this.parentNodes[0].right !== null) {
				this.parentNodes.shift();
			}
		}
		// add to parentNodes new node
		this.parentNodes.push(node);
		this.count++;
	}

	shiftNodeUp(node) {
		// if node doesn't have a parent or parent has value more then current node, it's max top for current node
		if (node.parent === null || node.priority <= node.parent.priority) {
			return;
		}

		let nodeIndex = this.parentNodes.indexOf(node);
		let parentIndex = this.parentNodes.indexOf(node.parent);

		// if parentNodes array has node, remove and add parent of node
		if (nodeIndex !== -1) {
			this.parentNodes.splice(nodeIndex, 1, node.parent);
		}
		// if parentNodes array has parent node , remove and add node
		if (parentIndex !== -1) {
			this.parentNodes.splice(parentIndex, 1, node);
		}

		// swap nodes
		node.swapWithParent();
		this.shiftNodeUp(node);
		this.root = node;
	}

	shiftNodeDown(node) {
		// sort the graph to the top was the smallest element
		if (node.left === null && node.right === null) {
			return node.parent;
		}
		// if left element less then right element, swap them. After all changes we swap them again. It needs for algorithm
		let swap = false;
		// if element has 2 children and left element less then right element, swap
		if (node.left !== null && node.right !== null) {
			if (node.left.priority < node.right.priority) {
				swap = true;
				this._swapChild(node);
			}
		}

		// if left element exist and more then node, swap
		if (node.left !== null && node.left.priority > node.priority) {
			node.left.swapWithParent();
			node = this.shiftNodeDown(node);
		}
		// if right element exist and more then node, swap
		if (node.right !== null && node.right.priority > node.priority) {
			node.right.swapWithParent();
			node = this.shiftNodeDown(node);
		}

		// if we swapped elements at the beginning, swap them again
		if (swap) {
			this._swapChild(node);
		}
		// if element has parent, return node parent like current element
		if (node.parent !== null) {
			return node.parent;
		}

		// create new parentNodes array after all changes
		this.parentNodes = [];
		this._createInsertedArray(node);
		this._topRoot();
		return node;
	}

	_createInsertedArray(current) {
		if (current === null || (current.left === null && current.right === null)) {
			return;
		}

		// if parentNodes doesn't have current and current has only one child, add current element to parentNodes
		if (this.parentNodes.indexOf(current) === -1 && (current.left === null || current.right === null)) {
			this.parentNodes.push(current);
		} else if (current.left !== null && current.right !== null) { // if current has two children, remove current from parentNodes
			let index = this.parentNodes.indexOf(current);
			if (index !== -1) {
				this.parentNodes.splice(index, 1);
			}
		}

		// if element has children, add them
		if (current.left !== null) {
			this.parentNodes.push(current.left);
		}
		if (current.right !== null) {
			this.parentNodes.push(current.right);
		}

		// add in parentNodes children from children of current element. recursion
		this._createInsertedArray(current.left);
		this._createInsertedArray(current.right);
	}

	_swapChild(parent) {
		let left = parent.left;
		let right = parent.right;

		parent.removeChild(right);
		parent.removeChild(left);
		parent.appendChild(right);
		parent.appendChild(left);
	}

	// search top root
	_topRoot() {
		while (this.root.parent !== null) {
			this.root = this.root.parent;
		}
	}
}

module.exports = MaxHeap;
