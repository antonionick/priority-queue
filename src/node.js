class Node {
	constructor(data, priority) {
		this.data = data;
		this.priority = priority;
		this.parent = null;
		this.left = null;
		this.right = null;
	}

	appendChild(node) {
		if (node === null || node === undefined) {
			return;
		}

		// add child in current node and add to child link of current node
		if (this.left === null) {
			this.left = node;
			node.parent = this;
		} else if (this.right === null) {
			this.right = node;
			node.parent = this;
		}
	}

	removeChild(node) {
		// if current node doesn't have the passed node, error
		if (this.left === node || this.right === node) {
			// delete the passed node from current node
			if (this.left === node) {
				this.left = null;
			} else if (this.right === node) {
				this.right = null;
			}
			node.parent = null;
		}
		else {
			throw new Error(``);
		}
	}

	remove() {
		// remove link to parent and parent remove link to current node
		if (this.parent === null) {
			return;
		}

		this.parent.removeChild(this);
	}

	swapWithParent() {
		// swap current node with parent node
		if (this.parent === null) {
			return;
		}

		let futureParent = this.parent.parent;
		let parent = this.parent;

		// if node has sibling, remove the sibling from parent element and return the sibling
		let sibling = this._swapParentChildren(parent);
		// add to parent element children of current node and delete they from current node
		this._defineChildrenForParent(parent);

		// swap
		if (futureParent === null) {
			// if parent is the root of the graph
			this.appendChild(parent);
		} else {
			futureParent.removeChild(parent);
			futureParent.appendChild(this);
			this.appendChild(parent);
		}
		this.appendChild(sibling);
	}

	_swapParentChildren(parent) {
		// suggest sibling it's the right child
		let sibling = parent.right;

		// if this element is the right child, sibling it's the left child
		if (parent.right === this) {
			sibling = parent.left;
		}
		// delete children from parent
		if (sibling !== null) {
			parent.removeChild(sibling);
		}
		parent.removeChild(this);

		return sibling;
	}

	_defineChildrenForParent(parent) {
		// add to parent element children of current node and delete they from current node
		let leftChild = this.left;
		let rightChild = this.right;

		if (leftChild !== null) {
			this.removeChild(leftChild);
			parent.appendChild(leftChild);
		}
		if (rightChild !== null) {
			this.removeChild(rightChild);
			parent.appendChild(rightChild);
		}
	}
}

module.exports = Node;
