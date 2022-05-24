import {Component, Input, OnInit} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {IPost} from '../../../../model/post.model';
import {PostService} from '../../../../services/post.service';
import {JhiEventManager} from '../../../../services/event-manager.service';

@Component({
    selector: 'app-delete-post-modal',
    templateUrl: './delete-post-modal.component.html'
})
export class DeletePostModalComponent implements OnInit {

    @Input() ngbModalRef: NgbModalRef;

    @Input() post: any;

    @Input() cards: IPost[] = [];

    @Input() updatePostModalRef: NgbModalRef;

    constructor(private modalService: NgbModal, private postService: PostService, private eventManager: JhiEventManager ) {
    }

    ngOnInit() {
    }

    deleteValue(value) {
        if (value === 'Yes') {
            this.postService.delete(this.post).subscribe((data: any) => {
                this.removeById(this.cards, this.post._id);
                this.eventManager.broadcast({
                    name: 'total-count-of-posts-changed'
                });
                this.updatePostModalRef.close();
            });
            this.ngbModalRef.dismiss();
        }
    }

    removeById(fromItems, id) {
        const index1 = fromItems.findIndex((element) => {
            return element._id === id;
        });
        if (index1 >= 0) {
            fromItems.splice(index1, 1);
        }
        return fromItems;
    }

    closeModal() {
        this.ngbModalRef.close();
    }
}
